/*
 *  jGine AliasWavefrontFile class
 *
 *  @see http://en.wikipedia.org/wiki/Wavefront_.obj_file
 */
define([
    "js/util",
    "../File",
    "../Promise",
    "../Vertex/3D",
    "../UV",
    "../Normal/3D",
    "../Face",
    "../Vertex/Face/3D",
    "../Object",
    "../Mesh",
    "../Material",
    "../Texture/Image"
], function (
    util,
    File,
    Promise,
    Vertex3D,
    UV,
    Normal3D,
    Face,
    FaceVertex3D,
    ObjectClass,
    Mesh,
    Material,
    ImageTexture
) { "use strict";

    function parseNumber(number) {
        return number * 1;
    }

    function AliasWavefrontFile(uri) {
        util.assertConstructor(this, AliasWavefrontFile);

        File.call(this, uri);
    }

    AliasWavefrontFile.prototype = Object.create(File.prototype);

    util.extend(AliasWavefrontFile.prototype, {
        read: function() {
            var promise = new Promise(this);

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

                        return new FaceVertex3D(vertex, vertexIndex, uv, normal);
                    }

                    var vertices = [],
                        uvs = [],
                        normals = [],
                        materials = {},
                        objects = {},
                        currentObject = null,
                        currentMesh = null,
                        lines = data.replace(/[\r\n]+/, "\n").split("\n"),
                        emptyUV = new UV(0, 0),
                        emptyNormal = new Normal3D(0, 0, 0),

                        builders = {
                            "v": function defineVertex(line) {
                                var args = line.split(" "),
                                    x = parseNumber(args[0]),
                                    y = parseNumber(args[1]),
                                    z = parseNumber(args[2]),
                                    w = args[3] !== undefined ? parseNumber(args[3]) : 1.0,
                                    vertex = new Vertex3D(x/w, y/w, z/w);

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
                                    face = new Face(vertex1, vertex2, vertex3);

                                currentMesh.faces.push(face);

                                // Face has 4 vertices: split into 2 faces as triangles
                                // TODO: Handle > 4 vertices too
                                if (args[3]) {
                                    face = new Face(vertex1, vertex3, parseVertex(args[3]));

                                    currentMesh.faces.push(face);
                                }
                            },
                            "o": function defineObject(name) {
                                var mesh = new Mesh(vertices, uvs, normals), // Default Mesh uses object's name
                                    object = new ObjectClass(name);

                                object.addMesh(mesh);

                                currentObject = object;
                                currentMesh = mesh;

                                objects[name] = object;
                            },
                            "g": function defineFaceGroup(name) {
                                var mesh = new Mesh(vertices, uvs, normals);

                                currentObject.addMesh(mesh);

                                currentMesh = mesh;
                            },
                            "s": function toggleSmoothShading(enable) {
                                currentMesh.toggleSmoothShading(enable === "1" || enable === "on");
                            },
                            "newmtl": function defineMaterial(name) {
                                //var material = new Material(name);

                                //materials[name] = material;
                            },
                            "usemtl": function useMaterial(name) {
                                currentMesh.setMaterial(materials[name]);
                            },
                            "mtllib": function importExternalMaterialFile(filename) {
                                console.warn("mtllib not implemented yet");

                                // FIXME
                                var material = new Material("hull"),
                                    texture = new ImageTexture("models/car.png");
                                materials["hull"] = material;

                                /*texture.loadImage()
                                    .done(function () {
                                        debugger;


                                    });*/

                                material.addAmbientTexture(texture);
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

                    util.each(lines, function (idx, line) {
                        var command;

                        if (line && line.charAt(0) !== "#") {
                            command = line.split(" ")[0];

                            if (builders[command]) {
                                builders[command](line.substr(command.length + 1));
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
    return AliasWavefrontFile;
});
