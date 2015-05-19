/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"], 
       (function($, StraightLine, Circle, ParametricCurve, BezierCurve) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
    
    
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };
           
        // generate random Y coordinate within the canvas
        var randomInt = function(int) { 
            return (Math.floor(Math.random() * int)); 
        };

        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };



        var randomRadius = function() {
            return Math.floor(Math.random()*200);
        };



        
        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*5)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));



        /*
         * event handler for "new circle button".
         */
        $("#btnNewCircle").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*5)+1,
                color: randomColor()
            };
                          
            var circle = new Circle( [randomX(), randomY()], randomRadius(), 
                                         style );
            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));

        /*
         * event handler for "new parametric curve button".
         */
        $("#btnNewParametricCurve").click( (function() {

            $('#marks').attr('checked', false);
        
            // create the actual parametric curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*5)+1,
                color: randomColor()
            };

            //var Xt = randomX() + "+100*Math.sin(t)";
            //var Yt = randomY() + "+100*Math.cos(t)";
            var Xt = $('#xt').val();
            var Yt = $('#yt').val();
            var tmin = randomInt(3);
            var tmax = randomInt(6);

            if(tmax < tmin || tmax == tmin){
                tmax = tmin + 1;
            }

            var segments = randomInt(20);          
            
            var parametric_curve = new ParametricCurve( Xt, Yt, tmin, tmax, segments, style );
            scene.addObjects([parametric_curve]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(parametric_curve); // this will also redraw
                        
        }));

        /*
         * event handler for "new bezier curve button".
         */
        $("#btnNewBezierCurve").click( (function() {

            $('#marksB').attr('checked', false); 
        
            // create the actual line and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 5) + 1,
                color: randomColor()
            };

            var p0 = [randomX(), randomY()];
            var p1 = [randomX(), randomY()];
            var p2 = [randomX(), randomY()];
            var p3 = [randomX(), randomY()];
            var segments = randomInt(20);

            var bezier_curve = new BezierCurve(p0, p1, p2, p3, segments, style);

            scene.addObjects([bezier_curve]);


            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(bezier_curve); // this will also redraw
                        
        }));

        // Select Object
        sceneController.onSelection((function(){

            $('#createDiv').show();
            var selection = sceneController.getSelectedObject();

            var color = selection.lineStyle.color;
            var width = selection.lineStyle.width;

            $("#color").val(color); 
            $("#width").val(width);

            $('#radius').val(selection.rad);  


            // if circle enable radius
            if(selection instanceof Circle){
                console.log("circle selected");
                $('#radiusDiv').show();
            }else{
                $('#radiusDiv').hide();
            }

            if(selection instanceof ParametricCurve){               
                console.log("parametric curve selected");
                $('#paraDiv').show();
                $('#xt').val(selection.currentXt);
                $('#yt').val(selection.currentYt);
                $('#tmin').val(selection.tmin);
                $('#tmax').val(selection.tmax);
                $('#seg').val(selection.segments);
                $('#marks').attr('checked', selection.tickMarks);
            }else{
                $('#paraDiv').hide();
            } 


            if(selection instanceof BezierCurve){               
                console.log("bezier curve selected");
                $('#bezierDiv').show();
                $('#P0X').val(selection.p0[0]);
                $('#P0Y').val(selection.p0[1]);
                $('#P1X').val(selection.p1[0]);
                $('#P1Y').val(selection.p1[1]);
                $('#P2X').val(selection.p2[0]);
                $('#P2Y').val(selection.p2[1]);
                $('#P3X').val(selection.p3[0]);
                $('#P3Y').val(selection.p3[1]);
                $('#segB').val(selection.segments);
                $('#marksB').attr('checked', selection.tickMarks); 
            }else{
                $('#bezierDiv').hide();
            }    

        }));

        // handle color input
        $("#color").on('input', function(){
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.lineStyle.color = $(this).val(); //set selected Color
                sceneController.select(selection); // redraw selection
            }            
        });


        // handle width input
        $("#width").on('input', function(){
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.lineStyle.width = $(this).val(); //set selected width
                sceneController.select(selection); // redraw selection
            }            
        });

        // handle radius input
        $('#radius').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.rad = parseInt($(this).val()); //set selected radius
                sceneController.select(selection); // redraw selection
            }
        });

        // handle Xt input
        $('#xt').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.currentXt = ($(this).val()); //set selected xt
                sceneController.select(selection); // redraw selection
            }
        });

        $('#yt').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.currentYt = ($(this).val()); //set selected yt
                sceneController.select(selection); // redraw selection
            }
        });
        
        $('#tmin').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.tmin = parseInt($(this).val()); //set selected tmin
                sceneController.select(selection); // redraw selection
            }
        });
        
        $('#tmax').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.tmax = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P0X').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p0[0] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P0Y').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p0[1] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P1X').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p1[0] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P1Y').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p1[1] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P2X').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p2[0] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P2Y').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p2[1] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P3X').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p3[0] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });

        $('#P3Y').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.p3[1] = parseInt($(this).val()); //set selected tmax
                sceneController.select(selection); // redraw selection
            }
        });
            
        $('#seg').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.segments = parseInt($(this).val()); //set selected segments
                sceneController.select(selection); // redraw selection
            }
        });

        $('#segB').on('input', function () {
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.segments = parseInt($(this).val()); //set selected segments
                sceneController.select(selection); // redraw selection
            }
        });

        $("#marks").change( function () {
            var selection = sceneController.getSelectedObject();
            if (selection !== null) {
                console.log($("#marks").is(':checked'));
                selection.tickMarks = $("#marks").prop('checked');
                sceneController.select(selection);
            }
        });

        $("#marksB").change( function () {
            var selection = sceneController.getSelectedObject();
            if (selection !== null) {
                console.log($("#marksB").is(':checked'));
                selection.tickMarks = $("#marksB").prop('checked');
                sceneController.select(selection);
            }
        });

    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
