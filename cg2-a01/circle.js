/*
 * Module: circle
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
    "use strict";

    /**
     *  A simple straight line that can be dragged 
     *  around by its endpoints.
     *  Parameters:
     *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
     *  - lineStyle: object defining width and color attributes for line drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
     */ 

    var Circle = function(point, radius, lineStyle) {

        console.log("creating circle at [" + 
                    point[0] + "," + point[1] + "] radius [" +
                    radius + "].");
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        // initial values in case either point is undefined
        this.pos = point || [10,10];
        this.rad = radius ||  10;     
    };

    // draw this line into the provided 2D rendering context
    Circle.prototype.draw = function(context) {

        context.beginPath();
        context.arc(this.pos[0], this.pos[1], // position
                    this.rad,    // radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
        context.closePath();
        
        // set drawing style
        context.lineWidth   = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;

        // actually start drawing
        context.stroke();
        
    };

    // test whether the mouse position is on this line segment
    Circle.prototype.isHit = function(context,mousePos) {

        // Vector length between circle center and mouse position
        var circlelength = vec2.length(vec2.sub(mousePos,this.pos));

        // Tolerance interval for selecting
        return circlelength >= this.rad -2 && circlelength <= this.rad + 2;

        // // what is my current position?
        // var pos = this.pos;
    
        // // check whether distance between mouse and dragger's center
        // // is less or equal ( radius + (line width)/2 )
        // var dx = mousePos[0] - pos[0];
        // var dy = mousePos[1] - pos[1];
        // var r = this.rad;

        // var hit = (dx*dx + dy*dy) <= (r*r);

        // console.log("Hit is: "+hit);

        // return hit; 
        
    };
    
    // return list of draggers to manipulate this line
    Circle.prototype.createDraggers = function() {
    
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for dragger
        var _circle = this;
        var getPos = function() { return _circle.pos; };
        var setPos = function(dragEvent) { _circle.pos = dragEvent.position; };
        draggers.push( new PointDragger(getPos, setPos, draggerStyle) );
        
        return draggers;
        
    };
    
    // this module only exports the constructor for Circle objects
    return Circle;

})); // define

    
