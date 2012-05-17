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
    "../Object",
    "../Mesh",
    "../Material",
    "../TextureMap",
    "../Group/Polygon",
    "../Group/Object"
], function(
    util,
    File,
    Promise,
    Vertex3D,
    UV,
    Normal3D,
    Face,
    ObjectClass,
    Mesh,
    Material,
    TextureMap,
    PolygonGroup,
    ObjectGroup
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
                    var vertices = [],
                        uvs = [],
                        normals = [],
                        objectGroup = new ObjectGroup(),
                        polygonGroups = {},
                        materials = {},
                        currentMesh = null,
                        currentMaterial = null,
                        smoothShadingEnabled = false,
                        lines = data.replace(/[\r\n]+/, "\n").split("\n"),
                        builders = {
                            "v": function defineVertex(line) {
                                var args = line.split(" "),
                                    x = parseNumber(args[0]),
                                    y = parseNumber(args[1]),
                                    z = parseNumber(args[2]),
                                    w = args[3] !== undefined ? parseNumber(args[3]) : 1.0,
                                    vertex = new Vertex3D(x/w, y/w, z/w);

                                vertices.push(vertex);
                            },
                            "vt": function defineUV(line) {
                                var args = line.split(" "),
                                    u = parseNumber(args[0]),
                                    v = args[1] !== undefined ? parseNumber(args[1]) : 1.0,
                                    w = args[2] !== undefined ? parseNumber(args[2]) : 1.0,
                                    uv = new UV(u/w, v/w);

                                uvs.push(uv);
                            },
                            "vn": function defineNormal(line) {
                                var args = line.split(" "),
                                    x = parseNumber(args[0]),
                                    y = parseNumber(args[1]),
                                    z = parseNumber(args[2]),
                                    normal = new Normal3D(x, y, z);

                                normal.normalize();

                                normals.push(normal);
                            },
                            "f": function defineFace(line) {
                                var args = line.split(" "),
                                    face = new Face();

                                // TODO: Handle UV coords & normals too

                                util.each(args, function (idx, vertexInfo) {
                                    face.addVertex(vertices[idx]);
                                });

                                if (smoothShadingEnabled) {
                                    face.enableSmoothShading();
                                }

                                currentMesh.addFace(face);
                            },
                            "o": function defineObject(name) {
                                var object = new ObjectClass(name),
                                    mesh = new Mesh();

                                object.addMesh(mesh);

                                objectGroup.addObject(object);

                                currentMesh = mesh;
                            },
                            "g": function definePolygonGroup(name) {
                                var polygonGroup = new PolygonGroup(name);

                                polygonGroups[name] = polygonGroup;
                            },
                            "s": function toggleSmoothShading(enable) {
                                smoothShadingEnabled = (enable === "1" || enable === "on");
                            },
                            "newmtl": function defineMaterial(name) {
                                var material = new Material(name);

                                materials[name] = material;

                                currentMaterial = materials[name];
                            },
                            "usemtl": function useMaterial(name) {
                                currentMaterial = materials[name];
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
                                currentMaterial.loadAmbientTextureMap(new TextureMap(path));
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

                    promise.resolve(objectGroup);
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
