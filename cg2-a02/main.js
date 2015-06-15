/*
  *
 * Module main: CG2 Aufgabe 2 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */

requirejs.config({
    paths: {
    
        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
            
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7",

    }
});


/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "webgl-debug", "animation", "scene", "html_controller"], 
       (function($, glmatrix, WebGLDebugUtils, Animation, Scene, HtmlController ) {

    "use strict";

    /*
     * create an animation that rotates the scene around 
     * the Y axis over time. 
     */
    var makeAnimation = function(scene) {
    
        // create animation to rotate the scene
        var animation = new Animation( (function(t, deltaT) {

            // rotation angle, depending on animation time
            var angle = deltaT/1000 * animation.customSpeed; // in degrees

            // ask the scene to rotate around Y axis
            scene.rotate("worldY", angle); 
                        
            // (re-) draw the scene
            scene.draw();
            
        } )); // end animation callback

        // set an additional attribute that can be controlled from the outside
        animation.customSpeed = 20; 

        return animation;
    
    };

    var roboterAnimation = function (scene) {
            var dt = 0;
            var ddt = 0;
            // create animation to rotate the scene
            var animation = new Animation((function (t, deltaT) {
                dt += deltaT * animation.customSpeed % 0.035;
                ddt += deltaT * animation.customSpeed % 0.04;
                var angle = Math.sin(dt) - Math.cos(dt);
                var armAngle = Math.sin(ddt) - Math.cos(ddt);


                scene.rotate("rightLowerArmUp", angle);
                scene.rotate("leftLowerArmDown", angle);
                scene.rotate("rightArmUp",armAngle);
                scene.rotate("rotateHeadLeft",armAngle);
                scene.rotate("rotateLeftHand",angle);
                scene.rotate("rotateRightHand",angle);
                scene.draw();

            } )); // end animation callback

            // set an additional attribute that can be controlled from the outside
            animation.customSpeed = 20; 

            return animation;

        };

    var makeWebGLContext = function(canvas_name) {
    
        // get the canvas element to be used for drawing
        var canvas=$("#"+canvas_name).get(0);
        if(!canvas) { 
            throw "HTML element with id '"+canvas_name + "' not found"; 
            return null;
        };

        // get WebGL rendering context for canvas element
        var options = {alpha: true, depth: true, antialias:true};
        var gl = canvas.getContext("webgl", options) || 
                 canvas.getContext("experimental-webgl", options);
        if(!gl) {
            throw "could not create WebGL rendering context";
        };
        
        // create a debugging wrapper of the context object
        var throwOnGLError = function(err, funcName, args) {
            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
        };
        var gl=WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
        
        return gl;
    };
    
    $(document).ready( (function() {
    
        // create WebGL context object for the named canvas object
        var gl = makeWebGLContext("drawing_area");
                                        
        // create scene, create animation, and draw once
        var scene = new Scene(gl);
        var animations = {};
        animations.rotateAll = makeAnimation(scene);
        animations.animateRoboter = roboterAnimation(scene);
        // var animation = makeAnimation(scene);
        // var animation2 = roboterAnimation(scene);
        scene.draw();        

        // mapping from character pressed on the keyboard to 
        // rotation axis and angle
        var keyMap = {
             'x': {axis: "worldX", angle:  5.0}, 
             'X': {axis: "worldX", angle: -5.0}, 
             'y': {axis: "worldY", angle:  5.0}, 
             'Y': {axis: "worldY", angle: -5.0},

             'r': {axis: "rightArmUp", angle: 1.0},
             'f': {axis: "rightArmDown", angle: -1.0},

             'e': {axis: "rightLowerArmUp", angle: 1.0},
             'd': {axis: "rightLowerArmDown", angle: -1.0},

             't': {axis: "leftArmUp", angle: 1.0},
             'g': {axis: "leftArmDown", angle: -1.0},

             'z': {axis: "leftLowerArmUp", angle: 1.0},
             'h': {axis: "leftLowerArmDown", angle: -1.0},

             'w': {axis: "rotateRightHand", angle: 1.0},
             's': {axis: "rotateLeftHand", angle: 1.0},

             'u': {axis: "rotateHeadLeft", angle: -1.0},
             'j': {axis: "rotateHeadRight", angle: 1.0},

             'o': {axis: "robotWave", angle: -1.0}
        };

        // create HtmlController that takes care of all interaction
        // of HTML elements with the scene and the animation
        var controller = new HtmlController(scene,animations,keyMap); 
        
    })); // $(document).ready()

    
    
})); // define module
        

