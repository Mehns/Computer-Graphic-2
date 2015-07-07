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
define(['vbo', 'models/parametric'],
    (function(vbo, ParametricSurface) {
        'use strict';
        var Torus = function(gl, solid,program) {

            this.program = program;

            var config = {
                "uMin": -Math.PI,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  3,
                "uSegments": 10,
                "vSegments": 10,
                "drawStyle": "points"
            };
            var configWire = {
                "uMin": -Math.PI,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  3,
                "uSegments": 20,
                "vSegments": 20,
                "drawStyle": "wireframe"
            };

            var config3 = {
                "uMin": -Math.PI,
                "uMax":  Math.PI,
                "vMin": -Math.PI,
                "vMax":  Math.PI,
                "uSegments": 40,
                "vSegments": 20,
                "drawStyle": "triangles"
            };

/*            var radiusTorus = 5;
            var radiusSize = 2;*/

            var positionFunc = function(u,v) {
                return [ (0.5 + 0.2 * Math.cos(v)) * Math.cos(u),
                (0.5 + 0.2 * Math.cos(v)) * Math.sin(u),
                
                        0.5 * Math.sin(v)
                     ];
            };

/*            var positionFunc = function(u,v) {
                return [ (5 + 2 * Math.cos(v)) * Math.cos(u),
                     (5 + 2 * Math.cos(v)) * Math.sin(u),
                    2 * Math.sin(u) ];
            };*/



            if (solid) {
                this.torus = new ParametricSurface(gl, positionFunc, configWire);
            } else {
                this.torus = new ParametricSurface(gl, positionFunc, config);
            }
        };
        Torus.prototype.draw = function(gl) {
            this.torus.draw(gl, this.program);
        };
        return Torus;
    }));