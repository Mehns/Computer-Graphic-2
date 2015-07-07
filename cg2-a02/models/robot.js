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


        var positionFunc = function(u,v) {
            return [ 0.5 * Math.sin(u) * Math.cos(v),
                     0.3 * Math.sin(u) * Math.sin(v),
                     0.9 * Math.cos(u) ];
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

            // Components to build robot
            var cube = new Cube(gl);
            var ellipsoid = new ParametricSurface(gl, positionFunc, config2);
            var ellipsoid2 = new ParametricSurface(gl, positionFunc, config3);
            var cylinder = new Cylinder(gl, true, program.uni);
            var band2 = new Band(gl,{
                    drawStyle: 'triangles',
                    height: 1
                });
            var band = new Band(gl,{
                    drawStyle: 'triangles',
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
            

            this.neck = new SceneNode("neck");
            
            

            // arm left
            this.shoulderL = new SceneNode("shoulderL");
            
            

            this.armLU = new SceneNode("armLU");
            
            

            this.elbowL = new SceneNode("elbowL");
            
            

            this.armLD = new SceneNode("armLD");
            mat4.translate(this.armLD.transform(), [0, -armSize[1]/2, 0]);
            

            this.handL = new SceneNode("handL");
            mat4.translate(this.handL.transform(), [0, -armSize[1]/2, 0]);
            


            // arm right
            this.shoulderR = new SceneNode("shoulderR");
            mat4.translate(this.shoulderR.transform(), [-(torsoSize[0]/2 + shoulderSize[0]/2), torsoSize[0]/2, 0]);
            

            this.armRU = new SceneNode("armRU");
            mat4.translate(this.armRU.transform(), [0, -armSize[1]/2, 0]);
            

            this.elbowR = new SceneNode("elbowR");
            mat4.translate(this.elbowR.transform(), [0, -armSize[1]/2, 0]);
            

            this.armRD = new SceneNode("armRD");
            mat4.translate(this.armRD.transform(), [0, -armSize[1]/2, 0]);
            

            this.handR = new SceneNode("handR");
            mat4.translate(this.handR.transform(), [0, -armSize[1]/2, 0]);
            



            // Roboter skeleton
			this.neck.add(this.head);
            this.torso.add(this.neck);
            this.torso.add(this.shoulderL);
            this.shoulderL.add(this.armLU);
            this.armLU.add(this.elbowL);
            this.elbowL.add(this.armLD);
            this.armLD.add(this.handL);
            this.torso.add(this.shoulderR);
            this.shoulderR.add(this.armRU);
            this.armRU.add(this.elbowR);
            this.elbowR.add(this.armRD);
            this.armRD.add(this.handR);



            // Roboter skins
            var torsoSkin = new SceneNode("torsoSkin");
            mat4.scale(torsoSkin.transform(), torsoSize);
            torsoSkin.add(cube, bodyColor);

            var headSkin = new SceneNode("headSkin");
            mat4.rotate(headSkin.transform(), 0.5 * Math.PI, [0,1,0]); // wegen der Farben*/
            mat4.scale(headSkin.transform(), headSize);
            mat4.translate(this.head.transform(), [0, neckSize[1]-headSize[1]/5, 0]);
            headSkin.add(ellipsoid2, program.red);
            headSkin.add(ellipsoid, program.uni);

            var neckSkin = new SceneNode("neckSkin");
            mat4.scale(neckSkin.transform(), neckSize);
            mat4.translate(this.neck.transform(), [0, torsoSize[1]/2, 0]);
            //neckSkin.add(cube, bodyColor);
            neckSkin.add(band2, program.uni);


            var shoulderLSkin = new SceneNode("shoulderLSkin");
            mat4.scale(shoulderLSkin.transform(), shoulderSize);
            mat4.translate(this.shoulderL.transform(), [torsoSize[0]/2 + shoulderSize[0]/2, torsoSize[0]/2, 0]);
            shoulderLSkin.add(cube, bodyColor);

            var armLUSkin = new SceneNode("armLUSkin");
/*            mat4.rotate(armLUSkin.transform(), 0.6*Math.PI, [1,0,0]);*/
            mat4.scale(armLUSkin.transform(), armSize);
            mat4.translate(this.armLU.transform(), [0, -armSize[1]/2, 0]);
            armLUSkin.add(cube, bodyColor);

            var elbowLSkin = new SceneNode("elbowLSkin");
            mat4.scale(elbowLSkin.transform(), elbowSize);
            mat4.translate(this.elbowL.transform(), [0, -armSize[1]/2, 0]);
            elbowLSkin.add(cube, bodyColor);
            elbowLSkin.add(band, program.red);

            var handLSkin = new SceneNode("handLSkin");
            handLSkin.add(cube, bodyColor);
            mat4.scale(handLSkin.transform(), handSize);

            // Connection skeleton + skins
            this.torso.add(torsoSkin);
            this.head.add(headSkin);
            this.neck.add(neckSkin);
            // arm left            
            this.shoulderL.add(shoulderLSkin);
            this.armLU.add(armLUSkin);
            this.elbowL.add(elbowLSkin);
            this.armLD.add(armLUSkin);
            this.handL.add(handLSkin);
            // arm right
            this.shoulderR.add(shoulderLSkin);
            this.armRU.add(armLUSkin);
            this.elbowR.add(elbowLSkin);
            this.armRD.add(armLUSkin);
            this.handR.add(handLSkin);

        }; // constructor


        Robot.prototype.rightArmUp = function (angle) {
                mat4.rotate(this.shoulderR.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.rightArmDown = function (angle) {
                mat4.rotate(this.shoulderR.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.rightLowerArmUp = function (angle) {
                mat4.rotate(this.elbowR.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.rightLowerArmDown = function (angle) {
                mat4.rotate(this.elbowR.transform(),angle, [-1, 0, 0]);
            }
            Robot.prototype.leftArmUp = function (angle) {
                mat4.rotate(this.shoulderL.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.leftArmDown = function (angle) {
                mat4.rotate(this.shoulderL.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.leftLowerArmUp = function (angle) {
                mat4.rotate(this.elbowL.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.leftLowerArmDown = function (angle) {
                mat4.rotate(this.elbowL.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.rotateLeftHand = function(angle) {
                mat4.rotate(this.handL.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rotateRightHand = function(angle) {
                mat4.rotate(this.handR.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rotateHeadRight = function(angle) {
                mat4.rotate(this.head.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rotateHeadLeft = function(angle) {
                mat4.rotate(this.head.transform(), angle, [0, 1, 0]);
            }

            Robot.prototype.wave = function() {
                mat4.rotate(this.head.transform(), 0.1, [0, 0, 1]);
            }

        Robot.prototype.draw = function(gl, program, transformation) {
            this.torso.draw(gl, null, transformation);
        };
        return Robot;
    }));