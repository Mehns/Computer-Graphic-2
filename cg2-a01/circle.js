/*
 * Module: circle
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "circle_dragger"], 
       (function(Util,vec2,Scene,PointDragger, CircleDragger) {
       
    "use strict";

    /**
     *  A simple circle that can be dragged 
     *  around by its endpoints.
     *  Parameters:
     *  - point: array objects representing [x,y] coordinates of circle center
     *  - radius: radius of circle
     *  - lineStyle: object defining width and color attributes for circle drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
     */ 

    var Circle = function(point, radius, lineStyle) {

        console.log("creating circle at [" + 
                    point[0] + "," + point[1] + "] radius [" +
                    radius + "].");
        
        // draw style for drawing the circle
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        // initial values in case either point/radius is undefined
        this.pos = point || [10,10];
        this.rad = radius ||  10;     
    };

    // draw this circle into the provided 2D rendering context
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

    // test whether the mouse position is on the circle outline
    Circle.prototype.isHit = function(context,mousePos) {

        // vector between circle center and mouse position
        var distance = vec2.length(vec2.sub(this.pos, mousePos));
        var sensitivity = (this.lineStyle.width/2)+2;
        var difference = Math.max(this.rad,distance) - Math.min(this.rad,distance);

        return difference <= sensitivity;
    };
    
    // return list of draggers to manipulate this circle
    Circle.prototype.createDraggers = function() {
    
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for dragger
        var _circle = this;
        
        // positions of circle center before and after drag
        var getPos = function() { return _circle.pos; };
        var setPos = function(dragEvent) { _circle.pos = dragEvent.position; };

        // radius of circle before and after drag
        // vec2.add(v0,v1) needs vector with 2 components
        var getRad = function(){ return vec2.add( _circle.pos,[0,_circle.rad] ); };
        var setRad = function(dragEvent) { 
                        var newRad = dragEvent.position;
        				_circle.rad = newRad[1] - _circle.pos[1];
                        $('#radius').val(_circle.rad);
                    };

        draggers.push( new PointDragger(getPos, setPos, draggerStyle) );
        draggers.push( new CircleDragger(getRad, setRad, draggerStyle) );
        
        return draggers;
        
    };
    
    // this module only exports the constructor for Circle objects
    return Circle;

})); // define

    
