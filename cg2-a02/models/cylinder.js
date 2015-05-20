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
        var Cylinder = function(gl, solid,program) {

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

            var positionFunc = function(u,v) {
                return [ 0.5 * Math.cos(u),
                     0.5 * Math.sin(u),
                    0.2 * v ];
            };
            if (solid) {
                this.cylinder = new ParametricSurface(gl, positionFunc, config);
            } else {
                this.cylinder = new ParametricSurface(gl, positionFunc, configWire);
            }
        };
        Cylinder.prototype.draw = function(gl) {
            this.cylinder.draw(gl, this.program);
        };
        return Cylinder;
    }));