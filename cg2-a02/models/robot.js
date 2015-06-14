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
define(['gl-matrix', 'vbo', 'models/parametric', 'models/cube', 'models/cylinder', 'models/band', 'scene_node'],
    (function(glmatrix, vbo, ParametricSurface, Cube, Cylinder, Band, SceneNode) {
        'use strict';
        var Robot = function(gl, program) {

            // Components to build robot
            var cube = new Cube(gl);
            var cylinder = new Cylinder(gl);
            var band = new Band(gl,{
                    drawStyle: 'wireframe',
                    height: 0.4
                });

            //Colors
            var bodyColor = program.vertexColor;


            // Dimensionen der in der Zeichnung benannten Teile
            var headSize    = [0.4, 0.35, 0.3];
            var torsoSize   = [0.4, 0.6, 0.4];
            var neckSize    = [0.1, 0.3, 0.1];
            var armSize     = [0.1, 0.3, 0.1];
            var shoulderSize = [0.2, 0.2, 0.2];
            var elbowSize   = [0.15, 0.15, 0.15];
            var handSize    = [0.15, 0.2, 0.15];

            // Skeleton 
            this.torso = new SceneNode("torso");

            this.head = new SceneNode("head");
            mat4.translate(this.head.transform(), [0, neckSize[1], 0]);

            this.neck = new SceneNode("neck");
            mat4.translate(this.neck.transform(), [0, torsoSize[1]/2, 0]);
            this.neck.add(this.head);
            this.torso.add(this.neck);

            // arm left
            this.shoulderL = new SceneNode("shoulderL");
            mat4.translate(this.shoulderL.transform(), [torsoSize[0]/2 + shoulderSize[0]/2, torsoSize[0]/2, 0]);
            this.torso.add(this.shoulderL);

            this.armLU = new SceneNode("armLU");
            mat4.translate(this.armLU.transform(), [0, -armSize[1]/2, 0]);
            this.shoulderL.add(this.armLU);

            this.elbowL = new SceneNode("elbowL");
            mat4.translate(this.elbowL.transform(), [0, -armSize[1]/2, 0]);
            this.armLU.add(this.elbowL);

            this.armLD = new SceneNode("armLD");
            mat4.translate(this.armLD.transform(), [0, -armSize[1]/2, 0]);
            this.elbowL.add(this.armLD);

            this.handL = new SceneNode("handL");
            mat4.translate(this.handL.transform(), [0, -armSize[1]/2, 0]);
            this.armLD.add(this.handL);


            // arm right
            this.shoulderR = new SceneNode("shoulderR");
            mat4.translate(this.shoulderR.transform(), [-(torsoSize[0]/2 + shoulderSize[0]/2), torsoSize[0]/2, 0]);
            this.torso.add(this.shoulderR);

            this.armRU = new SceneNode("armRU");
            mat4.translate(this.armRU.transform(), [0, -armSize[1]/2, 0]);
            this.shoulderR.add(this.armRU);

            this.elbowR = new SceneNode("elbowR");
            mat4.translate(this.elbowR.transform(), [0, -armSize[1]/2, 0]);
            this.armRU.add(this.elbowR);

            this.armRD = new SceneNode("armRD");
            mat4.translate(this.armRD.transform(), [0, -armSize[1]/2, 0]);
            this.elbowR.add(this.armRD);

            this.handR = new SceneNode("handR");
            mat4.translate(this.handR.transform(), [0, -armSize[1]/2, 0]);
            this.armRD.add(this.handR);



            // Skins
            var torsoSkin = new SceneNode("torso skin");
            torsoSkin.add(cube, bodyColor);
            mat4.scale(torsoSkin.transform(), torsoSize);

            var headSkin = new SceneNode("head skin");
            headSkin.add(cube, bodyColor);
/*            mat4.rotate(headSkin.transform(), 0.6 * Math.PI, [0,1,0]); // wegen der Farben*/
            mat4.scale(headSkin.transform(), headSize);

            var neckSkin = new SceneNode("neck skin");
            neckSkin.add(cube, bodyColor);
            mat4.scale(neckSkin.transform(), neckSize);

            var armLUSkin = new SceneNode("armLU skin");
            armLUSkin.add(cube, bodyColor);
/*            mat4.rotate(armLUSkin.transform(), 0.6*Math.PI, [1,0,0]);*/
            mat4.scale(armLUSkin.transform(), armSize);

            var shoulderLSkin = new SceneNode("shoulderL skin");
            shoulderLSkin.add(cube, bodyColor);
            mat4.scale(shoulderLSkin.transform(), shoulderSize);

            var elbowLSkin = new SceneNode("elbowL skin");
            elbowLSkin.add(cube, bodyColor);
            mat4.scale(elbowLSkin.transform(), elbowSize);

            var handSkin = new SceneNode("handL skin");
            handSkin.add(cube, bodyColor);
            mat4.scale(handSkin.transform(), handSize);

            // Connection Skeleton + Skins
            this.torso.add(torsoSkin);
            this.head.add(headSkin);
            this.neck.add(neckSkin);
            // arm left            
            this.shoulderL.add(shoulderLSkin);
            this.armLU.add(armLUSkin);
            this.elbowL.add(elbowLSkin);
            this.armLD.add(armLUSkin);
            this.handL.add(handSkin);
            // arm right
            this.shoulderR.add(shoulderLSkin);
            this.armRU.add(armLUSkin);
            this.elbowR.add(elbowLSkin);
            this.armRD.add(armLUSkin);
            this.handR.add(handSkin);

        }; // constructor


        Robot.prototype.draw = function(gl, program, transformation) {
            this.torso.draw(gl, null, transformation);
        };
        return Robot;
    }));