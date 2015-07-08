/*
  *
 * Module scene: Computergrafik 2, Aufgabe 3
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["gl-matrix", "program", "scene_node", "shaders", "directional_light", "material", "texture", 
        "models/cube", "models/sphere"], 
       (function(glmatrix, Program, SceneNode, shaders, DirectionalLight, Material, texture, 
        Cube, Sphere) {

    "use strict";

    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  

        // set of GPU programs to be used
        this.programs = {};
        this.programs.unicolor = new Program(gl, shaders.getVertexShader("unicolor"), 
                                             shaders.getFragmentShader("unicolor") );
        this.programs.planet = new Program(gl, shaders.getVertexShader("planet"), 
                                              shaders.getFragmentShader("planet") );

        // set of materials to be used
        this.materials = {};
        this.materials.blue   = new Material("blue", this.programs.unicolor);
        this.materials.grid   = new Material("grid", this.programs.unicolor);
        this.materials.planet = new Material("planet", this.programs.planet);

        // set uniforms required by the respective shaders
        this.materials.blue.setUniform( "uniColor", "vec4", [0.1, 0.1, 0.8, 1] );
        this.materials.grid.setUniform( "uniColor", "vec4", [0.7, 0.7, 0.7, 1] );
        this.materials.planet.setUniform( "material.ambient",   "vec3", [0.6,0.2,0.2] ); 
        this.materials.planet.setUniform( "material.diffuse",   "vec3", [0.8,0.2,0.2] ); 
        this.materials.planet.setUniform( "material.specular",  "vec3", [0.4,0.4,0.4] ); 
        this.materials.planet.setUniform( "material.shininess", "float", 200 ); 

        // set light properties for shader
        this.materials.planet.setUniform( "ambientLight", "vec3", [0.4,0.4,0.4]);
        this.materials.planet.setUniform( "light.on", "bool", true );
        this.materials.planet.setUniform( "light.type", "int", 0 );
        this.materials.planet.setUniform( "light.direction", "vec3", [-1,0,0] );
        this.materials.planet.setUniform( "light.color", "vec3", [1,1,1] );

        // TODO load and create required textures
        this.dayTexture = new texture.Texture2D(gl, "textures/earth_month04.jpg");
        this.nightTexture = new texture.Texture2D(gl, "textures/earth_at_night_2048.jpg");
        this.bathymetryTexture = new texture.Texture2D(gl, "textures/earth_bathymetry_2048.jpg");
        this.cloudsTexture = new texture.Texture2D(gl, "textures/earth_clouds_2048.jpg");

        var _scene = this;
            texture.onAllTexturesLoaded(function(){
                _scene.programs.planet.use();
                _scene.programs.planet.setTexture("dayTexture", 0, _scene.dayTexture);
                _scene.programs.planet.setTexture("nightTexture", 1, _scene.nightTexture);
                _scene.programs.planet.setTexture("bathymetryTexture", 2, _scene.bathymetryTexture);
                _scene.programs.planet.setTexture("cloudsTexture", 3, _scene.cloudsTexture);
                _scene.draw();
            });

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.worldTransformation = mat4.identity();

        // light node - rotation will change light direction
        this.sunLight = new DirectionalLight();
        this.sunNode = new SceneNode("Sunlight");
        this.sunNode.add(this.sunLight);
        // which shaders/materials will be affected by this light?
        this.sunLight.addMaterial(this.materials.planet);

        // planet surface
        var surfaceConfig = {
            drawStyle: 'surface'
        }
        this.planetSurface = new Sphere(gl, surfaceConfig);
        this.surfaceNode = new SceneNode("Surface");
        this.surfaceNode.add(this.planetSurface, this.materials.planet);

        // planet wireframes
        var wireConfig = {
            drawStyle: 'wireframe'
        }
        this.planetWireframe = new Sphere(gl, wireConfig);
        this.wireframeNode = new SceneNode("Wireframe");
        this.wireframeNode.add(this.planetWireframe, this.materials.grid);


        // planet node contains surface + wireframe
        this.planetNode = new SceneNode("Planet");
        this.planetNode.add(this.surfaceNode);
        this.planetNode.add(this.wireframeNode);

        // rotate cube so that we see two faces initially 
        mat4.rotate(this.planetNode.transform(), Math.PI/2, [1,0,0]);

        // our universe: planet + sunlight
        this.universeNode = new SceneNode("Universe");
        this.universeNode.add(this.planetNode);
        this.universeNode.add(this.sunNode);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { 
                             "Show Surface": true,
                             "Show Grid": false,
                             "Debug": false,
                             "DayTexture": true,
                             "NightTexture": false,
                             "RedGreen": false,
                             "GlossMap": false,
                             "Clouds": false
                             };                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = mat4.perspective(45, aspectRatio, 0.01, 100); 
                             
        // multiple world and camera transformations to obtain model-view matrix
        var modelViewMatrix = mat4.create(this.cameraTransformation); 
        mat4.multiply(modelViewMatrix, this.worldTransformation);

        // set the uniform variables for all used programs
        for(var p in this.materials) {
            this.materials[p].setUniform("projectionMatrix", "mat4", projection);
        }

        // clear color and depth buffers
        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  

        // show/hide certain parts of the scene            
        this.surfaceNode.setVisible( this.drawOptions["Show Surface"] ); 
        this.wireframeNode.setVisible( this.drawOptions["Show Grid"] );
        this.materials.planet.setUniform("debug", "bool", this.drawOptions["Debug"] );
        this.materials.planet.setUniform("dayOn", "bool", this.drawOptions["DayTexture"]);
        this.materials.planet.setUniform("nightOn", "bool", this.drawOptions["NightTexture"]);
        this.materials.planet.setUniform("redgreen", "bool", this.drawOptions["RedGreen"]);
        this.materials.planet.setUniform("gloss", "bool", this.drawOptions["GlossMap"]);
        this.materials.planet.setUniform("clouds", "bool", this.drawOptions["Clouds"]);

        // draw the scene 
        this.universeNode.draw(gl, null, modelViewMatrix);
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
                mat4.rotate(this.worldTransformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.worldTransformation, angle, [1,0,0]);
                break;
            case "sunLight": 
                // rotate the sunlight around the Y axis
                mat4.rotate(this.sunNode.transformation, angle, [0,1,0] );
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
        

