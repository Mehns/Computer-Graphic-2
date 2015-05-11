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
define(["jquery", "straight_line", "circle"], 
       (function($, StraightLine, Circle) {

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
                width: Math.floor(Math.random()*3)+1,
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
                width: Math.floor(Math.random()*8)+1,
                color: randomColor()
            };
                          
            var circle = new Circle( [randomX(),randomY()], randomRadius(), 
                                         style );
            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));


        // Select Object
        sceneController.onSelection((function(){

            var selection = sceneController.getSelectedObject();

            var color = selection.lineStyle.color;
            var width = selection.lineStyle.width;

            $("#color").val(color); 
            $("#width").val(width);

            // if circle enable radius
            if(selection.rad != null){
                console.log("Circle selected");
                console.log("Radius: "+selection.rad);


                var radius = selection.rad;
                
                $('#radius').val(radius); 
                $('#radiusDiv').show();
            }
            else{
                console.log("No Circle");
                 $('#radiusDiv').hide();
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
                selection.lineStyle.width = $(this).val(); //set selected Width
                sceneController.select(selection); // redraw selection
            }            
        });

        // handle radius input
        $("#radius").on('input', function(){
            var selection = sceneController.getSelectedObject(); //get selected Object
            if(selection !== null){
                selection.rad = $(this).val(); //set selected radius
                sceneController.select(selection); // redraw selection
            }            
        });
        
        
    
    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
