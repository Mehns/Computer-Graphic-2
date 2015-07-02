/*
 * WebGL core teaching framwork
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 *
 */


/* requireJS module definition */
define(["vbo"],
       (function(vbo) {

    "use strict";

    /* constructor for Parametric Surface objects
     * gl:  WebGL context object
     * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
     * config: configuration object defining attributes uMin, uMax, vMin, vMax,
     *         and drawStyle (i.e. "points", "wireframe", or "surface")
     */
    var ParametricSurface = function(gl, posFunc, normalFunc, config) {

        // read the configuration parameters
        config = config || {};
        var uMin       = config.uMin   || -Math.PI;
        var uMax       = config.uMax   || Math.PI;
        var vMin     = config.vMin || -Math.PI;
        var vMax     = config.vMax || Math.PI;
        var uSegments = config.uSegments || 40;
        var vSegments = config.vSegments || 20;

        this.drawStyle   = config.drawStyle || "points";


        window.console.log("Creating a ParametricSurface");

        // generate vertex coordinates and normals store in an array
        var coords = [];
        var normals = [];

        // calculate steplength between points
        var uStep = (uMax - uMin) / uSegments;
        var vStep = (vMax - vMin) / vSegments;

        // sampling in two loops for u and v
        for(var i=0; i<=uSegments; i++) {
            for(var j=0; j<=vSegments; j++) {

                // calculate u and v for segmentCount
                var u = uMin + i * uStep;
                var v = vMin + j * vStep;

                // calculate actual points with given function
                var pos = posFunc(u, v);
                coords.push(pos[0], pos[1], pos[2]);

                // calculate normals
                var normal = normalFunc(u,v);
                normals.push(normal[0], normal[1], normal[2])

            }
        }


        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords
                                                  } );

        // create normal buffer object (VBO) for the coordinates
        this.normalBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": normals
                                                  } );



            if(this.drawStyle == "surface"){
                //Console.log("triangles");
                var triangles = [];
                for(var i = 0; i < uSegments; i++) {
                    for(var j = 0; j < vSegments; j++) {
                        var k = i * (vSegments + 1) + j;
                        triangles.push(k, k + 1, k + vSegments + 1);
                        triangles.push(k + vSegments + 1, k + vSegments + 2, k + 1);
                    }
                }
                this.triangleBuffer = new vbo.Indices(gl, {
                    "indices" : triangles
                });
            }
            if(this.drawStyle == "wireframe"){
                //Console.log("wireframe");
                var wireFrameIndizes = [];
                for(var i = 0; i < uSegments; i++) {
                    for (var j = 0; j < vSegments; j++) {
                        var vindex = i * (vSegments + 1) + j;
                        var iindex = i * vSegments + j;
                        var ii = iindex * 4;
                        wireFrameIndizes[ii++] = vindex;
                        wireFrameIndizes[ii++] = vindex + (vSegments + 1);
                        wireFrameIndizes[ii++] = vindex;
                        wireFrameIndizes[ii++] = vindex + 1;
                    }
                }

                this.wireFrameBuffer = new vbo.Indices(gl, {"indices":wireFrameIndizes});

            }


    };

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl, material) {
        material.apply();
        var program = material.getProgram();

        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.normalBuffer.bind(gl, program, "vertexNormal")


        if(this.triangleBuffer)
            this.triangleBuffer.bind(gl);

        if(this.wireFrameBuffer)
            this.wireFrameBuffer.bind(gl);


        if (this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
        }else if (this.drawStyle == "surface") {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(1.0, 1.0);
            gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
            gl.disable(gl.POLYGON_OFFSET_FILL);
        } else if(this.drawStyle == "wireframe"){
            gl.drawElements(gl.LINES, this.wireFrameBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        } else {
            window.console.log("Parametric: draw style " + this.drawStyle + " not implemented.");
        }
    };

    // this module only returns the constructor function
    return ParametricSurface;

})); // define
