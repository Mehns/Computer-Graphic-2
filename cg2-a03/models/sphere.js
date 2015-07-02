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
        var Sphere = function(gl, solid) {

            // this is a name for the user interface
            this.uiName = "Sphere";

            window.console.log("Creating a unit Sphere."); 

            if(solid){
                var config = {
                "uMin": 0,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  2 * Math.PI,
                "uSegments": 60,
                "vSegments": 60,
                "drawStyle": "surface"
                };
            } else {
                var config = {
                "uMin": 0,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  2 * Math.PI,
                "uSegments": 60,
                "vSegments": 60,
                "drawStyle": "wireframe"
                };
            }



            var positionFunc = function(u,v) {
                var radius = 1;
                return [ radius * Math.sin(u) * Math.cos(v),
                         radius * Math.sin(u) * Math.sin(v),
                         radius * Math.cos(u) ];
            };

            var normalFunc = function(u,v) {
                return [ Math.sin(u) * Math.cos(v),
                         Math.sin(u) * Math.sin(v),
                         Math.cos(u) ];
            };

            this.sphere = new ParametricSurface(gl, positionFunc, normalFunc, config);

        };
        Sphere.prototype.draw = function(gl, material) {
            this.sphere.draw(gl, material);
        };
        return Sphere;
    }));