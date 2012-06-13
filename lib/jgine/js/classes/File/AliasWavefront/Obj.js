/*
 *  jGine AliasWavefrontObjFile class
 *
 *  @see http://en.wikipedia.org/wiki/Wavefront_.obj_file
 */
define([
    "js/util",
    "../../File",
    "../../Funnel",
    "../../Promise",
    "../../Vector/4D",
    "../../UV",
    "../../Face",
    "../../Vertex/3D",
    "../../Object",
    "../../Mesh",
    "../../Material",
    "../../Texture/Image"
], function (
    util,
    File,
    Funnel,
    Promise,
    Vector4D,
    UV,
    Face,
    Vertex3D,
    ObjectClass,
    Mesh,
    Material,
    ImageTexture
) { "use strict";

    function parseNumber(number) {
        return number * 1;
    }

    function AliasWavefrontObjFile(uri) {
        util.assertConstructor(this, AliasWavefrontObjFile);

        File.call(this, uri);
    }

    AliasWavefrontObjFile.prototype = Object.create(File.prototype);

    util.extend(AliasWavefrontObjFile.prototype, {
        read: function(options) {
            var promise = new Promise(this),
                reverseWinding;

            options = options || {};
            reverseWinding = (options.reverseWinding === true);

            File.prototype.read.call(this)
                .done(function(data) {
                    function parseVertex(arg) {
                        var parts = arg.split("/"),
                            vertexIndex = (parts[0] || 0) - 1,
                            uvIndex = (parts[1] || 0) - 1,
                            normalIndex = (parts[2] || 0) - 1,
                            vertex,
                            uv,
                            normal;

                        if (vertexIndex < -1) {
                            vertexIndex += currentMesh.vertices.length;
                        }
                        if (uvIndex < -1) {
                            uvIndex += currentMesh.uvs.length;
                        }
                        if (normalIndex < -1) {
                            normalIndex += currentMesh.normals.length;
                        }

                        vertex = currentMesh.vertices[vertexIndex];
                        uv = currentMesh.uvs[uvIndex] || emptyUV;
                        normal = currentMesh.normals[normalIndex] || emptyNormal;

                        return new Vertex3D(vertex, uv, normal);
                    }

                    function createMesh(name) {
                        return new Mesh(currentMesh.vertices, currentMesh.uvs, currentMesh.normals, name);
                    }

                    var materials = {},
                        objects = [],
                        currentObject = null,
                        currentMesh = null,
                        lines = data.replace(/[\r\n]+/, "\n").split("\n"),
                        emptyUV = new UV(0, 0),
                        emptyNormal = new Vector4D(0, 0, 0),

                        builders = {
                            "v": function defineVertex(line) {
                                var args = line.split(" "),
                                    x = parseNumber(args[0]),
                                    y = parseNumber(args[1]),
                                    z = parseNumber(args[2]),
                                    w = args[3] !== undefined ? parseNumber(args[3]) : 1.0,
                                    vertex = new Vector4D(x/w, y/w, z/w);

                                currentMesh.vertices.push(vertex);
                            },
                            "vt": function defineUV(line) {
                                var args = line.split(" "),
                                    u = parseNumber(args[0]),
                                    v = args[1] !== undefined ? parseNumber(args[1]) : 1.0,
                                    w = args[2] !== undefined ? parseNumber(args[2]) : 1.0,
                                    uv = new UV(u/w, v/w);

                                currentMesh.uvs.push(uv);
                            },
                            "vn": function defineNormal(line) {
                                var args = line.split(" "),
                                    x = parseNumber(args[0]),
                                    y = parseNumber(args[1]),
                                    z = parseNumber(args[2]),
                                    normal = new Normal3D(x, y, z);

                                normal.normalize();

                                currentMesh.normals.push(normal);
                            },
                            "f": function defineFace(line) {
                                var args = line.split(" "),
                                    vertex1 = parseVertex(args[0]),
                                    vertex2 = parseVertex(args[1]),
                                    vertex3 = parseVertex(args[2]),
                                    face = reverseWinding ?
                                        new Face(vertex3, vertex2, vertex1) :
                                        new Face(vertex1, vertex2, vertex3);

                                currentMesh.faces.push(face);

                                // Face has 4 vertices: split into 2 faces as triangles
                                // TODO: Handle > 4 vertices too
                                if (args[3]) {
                                    face = reverseWinding ?
                                        new Face(parseVertex(args[3]), vertex3, vertex1) :
                                        new Face(vertex1, vertex3, parseVertex(args[3]));

                                    currentMesh.faces.push(face);
                                }
                            },
                            "o": function defineObject(name) {
                                // Reuse current object & mesh if not used yet
                                if (currentObject.meshes.length === 1 && currentObject.meshes[0].faces.length === 0) {
                                    currentObject.name = name;
                                    currentMesh.name = name;
                                } else {
                                    currentObject = new ObjectClass(name);
                                    objects.push(currentObject);

                                    // Always create a new mesh for the new object
                                    currentMesh = createMesh(name);
                                    currentObject.addMesh(currentMesh);
                                }
                            },
                            "g": function defineFaceGroup(name) {
                                // Reuse current mesh if not used yet
                                if (currentMesh.faces.length === 0) {
                                    currentMesh.name = name;
                                } else {
                                    currentMesh = createMesh(name);
                                    currentObject.addMesh(currentMesh);
                                }
                            },
                            "s": function toggleSmoothShading(enable) {
                                currentMesh.toggleSmoothShading(enable === "1" || enable === "on");
                            },
                            "newmtl": function defineMaterial(name) {
                                //var material = new Material(name);

                                //materials[name] = material;
                            },
                            "usemtl": function useMaterial(name) {
                                var material = materials[name];

                                if (!material) {
                                    material = materials.hull;
                                    //promise.reject(new Error("Material '" + name + "' does not exist"));
                                    //return false;
                                }

                                // Create a new mesh/face group if already some faces in current one
                                if (currentMesh.faces.length > 0) {
                                    currentMesh = createMesh(name);
                                    currentObject.addMesh(currentMesh);
                                }

                                currentMesh.setMaterial(material);
                            },
                            "mtllib": function importExternalMaterialFile(filename) {
                                console.warn("mtllib not implemented yet");
                            },
                            "Ka": function defineAmbientColor() {

                            },
                            "Kd": function defineDiffuseColor() {

                            },
                            "Ks": function defineSpecularColor() {

                            },
                            "Ns": function weightSpecularColor() {

                            },
                            "Ni": function () {

                            },
                            "d": function () {

                            },
                            "illum": function () {

                            },
                            "map_Kd": function defineAmbientTextureMap(path) {
                                fixme();
                                currentMaterial.loadAmbientTextureMap(new ImageTexture(path));
                            }
                        };

                    (function TEMP() {
                        // FIXME
                        var material = new Material("hull"),
                            texture = new ImageTexture("models/car.jpg");
                        material.addAmbientTexture(texture);
                        materials["hull"] = material;

                        var material = new Material("Material_femaleSkin.png"),
                            texture = new ImageTexture("models/femaleSkin.png");
                        material.addAmbientTexture(texture);
                        materials["Material_femaleSkin.png"] = material;

                        var material = new Material("Material.001_femaleHair.png"),
                            texture = new ImageTexture("models/femaleHair.png");
                        material.addAmbientTexture(texture);
                        materials["Material.001_femaleHair.png"] = material;
                    }());

                    // Default object & mesh
                    currentObject = new ObjectClass();
                    currentMesh = new Mesh();
                    currentObject.addMesh(currentMesh);
                    objects.push(currentObject);

                    util.each(lines, function (idx, line) {
                        var command;

                        if (line && line.charAt(0) !== "#") {
                            command = line.split(" ")[0];

                            if (builders[command]) {
                                if (builders[command](util.trim(line.substr(command.length + 1))) === false) {
                                    return false;
                                }
                            } else {
                                promise.reject(new Error("Invalid command identifier '" + command + "'"));
                                return false;
                            }
                        }
                    });

                    promise.resolve(materials, objects);
                })
                .fail(function() {
                    promise.reject();
                });

            return promise;
        }
    });

    // Export
    return AliasWavefrontObjFile;
});
