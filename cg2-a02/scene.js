/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 *
 */


/* requireJS module definition */
define(["gl-matrix", "program", "shaders", "models/band", "models/triangle", "models/cube",
        "models/parametric", "models/cylinder", "models/torus", "models/robot"],
       (function(glmatrix, Program, shaders, Band, Triangle, Cube, ParametricSurface, Cylinder, Torus, Robot ) {

    "use strict";

    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context
        this.gl = gl;

        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.red = new Program(gl,
                                        shaders.getVertexShader("red"),
                                        shaders.getFragmentShader("red") );
        this.programs.uni = new Program(gl,
                                        shaders.getVertexShader("unicolor"),
                                        shaders.getFragmentShader("unicolor") );
        this.programs.vertexColor = new Program(gl,
                                                shaders.getVertexShader("vertex_color"),
                                                shaders.getFragmentShader("vertex_color") );



        // create some objects to be drawn in this scene
        this.triangle  = new Triangle(gl);
        this.cube      = new Cube(gl);
        this.band      = new Band(gl, {height: 0.4, drawStyle: "points"});
        this.band_solid   = new Band(gl, {height: 0.4, drawStyle: "triangles"});
        this.band_wireframe   = new Band(gl, {height: 0.4, drawStyle: "wireframe"});

        this.cylinder  = new Cylinder(gl, true,this.programs.red);
        this.torus     = new Torus(gl, true,this.programs.red);
        this.robot = new Robot(gl, this.programs);

        // create a parametric surface to be drawn in this scene
        var positionFunc = function(u,v) {
            return [ 0.5 * Math.sin(u) * Math.cos(v),
                     0.3 * Math.sin(u) * Math.sin(v),
                     0.9 * Math.cos(u) ];
        };


        var config1 = {
            "uMin": -Math.PI,
            "uMax":  Math.PI,
            "vMin": -Math.PI,
            "vMax":  Math.PI,
            "uSegments": 40,
            "vSegments": 20,
            "drawStyle": "points"
        };

        var config2 = {
            "uMin": -Math.PI,
            "uMax":  Math.PI,
            "vMin": -Math.PI,
            "vMax":  Math.PI,
            "uSegments": 40,
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


        this.ellipsoid = new ParametricSurface(gl, positionFunc, config1);
        this.ellipsoid_solid = new ParametricSurface(gl, positionFunc, config3);
        this.ellipsoid_wireframe = new ParametricSurface(gl, positionFunc, config2);

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);

        // the scene has an attribute "drawOptions" that is used by
        // the HtmlController. Each attribute in this.drawOptions
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": false,
                             "Show Triangle": false,
                             "Show Cube": false,
                             "Show Band": false,
                             "Show Solid Band": false,
                             "Show Wireframe Band": false,
                             "Show Ellipsoid": false,
                             "Show Solid Ellipsoid": false,
                             "Show Wireframe Ellipsoid": false,
                             "Show Cylinder": false,
                             "Show Torus": false,
                             "Show Robot": true
                             };
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {

        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) :
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
            this.programs[p].setUniform('uniColor', 'vec4', [0, 0, 0, 1]);
        }

        // clear color and depth buffers
        gl.clearColor(0.7, 0.7, 0.7, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);



        // set unicolor shader to black
       /* this.programs.uni.setUniform("uniColor", "vec4", [0,1,0,1]);*/



        // draw the scene objects
        if(this.drawOptions["Show Triangle"]) {
            this.triangle.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Cube"]) {
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Band"]) {
            this.band.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Solid Band"]) {
            this.band_solid.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Wireframe Band"]) {
            this.band_wireframe.draw(gl, this.programs.uni);        
        }

        if(this.drawOptions["Show Ellipsoid"]) {
            this.ellipsoid.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Solid Ellipsoid"]) {
            this.ellipsoid_solid.draw(gl, this.programs.red);        
        }
        if(this.drawOptions["Show Wireframe Ellipsoid"]) {
            this.ellipsoid_wireframe.draw(gl, this.programs.uni);        
        }
        
        if(this.drawOptions["Show Cylinder"]) {
            this.cylinder.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Torus"]) {
            this.torus.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Robot"]) {
            this.robot.draw(gl, this.programs, this.transformation);
        }

    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        // window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;

        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "worldY":
                mat4.rotate(this.transformation, angle, [0,1,0]);
                break;
            case "worldX":
                mat4.rotate(this.transformation, angle, [1,0,0]);
                break;
             case 'rightArmUp':
                this.robot.rightArmUp(angle);
                break;
            case 'rightArmDown':
                this.robot.rightArmDown(angle);
                break;
            case 'rightLowerArmUp':
                this.robot.rightLowerArmUp(angle);
                break;
            case 'rightLowerArmDown':
                this.robot.rightLowerArmDown(angle);
                break;
            case 'leftArmUp':
                this.robot.leftArmUp(angle);
                break;
            case 'leftArmDown':
                this.robot.leftArmDown(angle);
                break;
            case 'leftLowerArmUp':
                this.robot.leftLowerArmUp(angle);
                break;
            case 'leftLowerArmDown':
                this.robot.leftLowerArmDown(angle);
                break;
            case 'rotateRightHand':
                this.robot.rotateRightHand(angle);
                break;
            case 'rotateLeftHand':
                this.robot.rotateLeftHand(angle);
                break;
            case 'rotateHeadRight':
                this.robot.rotateHeadRight(angle);
                break;
            case 'rotateHeadLeft':
                this.robot.rotateHeadLeft(angle);
                break;
            case 'robotWave':
                this.robot.wave();
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };

        // redraw the scene
        this.draw();
    }

    return Scene;

})); // define module
