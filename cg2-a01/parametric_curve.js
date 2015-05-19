/*
 * Module: parametric_curve
 */


/* requireJS module definition */
define(["util", "vec2", "scene"], 
       (function(Util,vec2,Scene) {
       
    "use strict";

    /**
     * A simple parametric curve cannot be dragged
     * Parameters:
     * - Xt : given functionX, calculates x - coordinate
     * - Yt : given functionY, calculates y - coordinate
     * - tmin: minimum of the domain
     * - tmax: maximum of the domain
     * - segments: number of parts of the curve
     * - lineStyle: object defining width and color attributes for curve drawing
     */ 

    var ParametricCurve= function(currentXt, currentYt, tmin, tmax, segments, lineStyle) {
        
        console.log("creating parametric curve with Xt: " + currentXt + ", Yt: " + currentYt + 
                    ", t min: " + tmin + ", t max " + tmax + " and " + segments + " segments");

        this.currentXt = currentXt || "400+(100*Math.sin(t))";
        this.currentYt = currentYt || "200+(100*Math.cos(t))";


        this.tmin = tmin || 0;
        this.tmax = tmax || 5;

        this.segments = segments || 20;
        
        this.pointArray = [];
        this.tickMarks = false;
        
        this.evalFunction = function (func, t) {
            return eval(func);
        };
        
        // draw style for drawing the parametric curve
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };  

    };

    // draw this Parametric Curve into the provided 2D rendering context
    ParametricCurve.prototype.draw = function(context) {

        try {
            var err = [this.evalFunction(this.currentXt, this.tmin), this.evalFunction(this.currentYt, this.tmin)];
        } catch (e) {
            alert("Bitte Formel überprüfen.");
            return;
        }

        //um wie viel wird t bei jedem Durchlauf erhöht
        var delta = (this.tmax - this.tmin) / this.segments;

        for (var i = 0; i <= this.segments; i++) {
            //t = tmin + i/N * (tmax - tmin)
            var t = this.tmin + i/this.segments * (this.tmax - this.tmin);

            //errechnete Punkte für jedes t, werden in array gelegt
            this.pointArray[i] = [this.evalFunction(this.currentXt, t), this.evalFunction(this.currentYt, t)];
        };

        this.drawCurve(context,this.pointArray,this.segments,this.tickMarks);
    };

    // draw function also for bezier curve
    ParametricCurve.prototype.drawCurve = function(context, pointArray, segments, tickMarks){
        
        context.beginPath();
        for(var j = 0; j < pointArray.length; j++){
            if (j == 0) {
                context.moveTo(pointArray[0][0], pointArray[0][1]);
            } else {
                context.lineTo(pointArray[j][0], pointArray[j][1]);
            };
        }

        // set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;

        // actually start drawing
        context.stroke();
        
        //if true draws the marks
        if (tickMarks) {
            context.beginPath();
            for (var k = 1; k < segments; k++) {
                // middle of segment
                var tangente = vec2.sub(pointArray[(k + 1)], pointArray[(k - 1)]);
                var norm = [tangente[1] * (-1), tangente[0]];
                var normalizedVecN = vec2.mult(norm, (1 / vec2.length(norm)));
                var tick0 = vec2.add(pointArray[k], vec2.mult(normalizedVecN, 10));
                var tick1 = vec2.sub(pointArray[k], vec2.mult(normalizedVecN, 10));
                context.moveTo(tick0[0], tick0[1]);
                context.lineTo(tick1[0], tick1[1]);
            };
             
            // draw style
            context.lineWidth = 1;
            context.strokeStyle = "#123456";
            
            // start drawing
            context.stroke();
        }
        
    };

    // test whether the mouse position is on this line segment
    ParametricCurve.prototype.isHit = function(context,mousePos) {

        var t = 0;
        for (var i = 0; i < this.pointArray.length -1; i++) {
            t = vec2.projectPointOnLine(mousePos, this.pointArray[i], this.pointArray[i + 1]);
            if (t >= 0 && t <= 1) {
                var pos = vec2.add(this.pointArray[i], vec2.mult(vec2.sub(this.pointArray[i + 1], this.pointArray[i]), t));
                var distance = vec2.length(vec2.sub(pos, mousePos));
                if (distance <= (this.lineStyle.width / 2) + 2){
                    return true;
                }
            }
        }
        return false;

    };
    
    // return list of draggers to manipulate this line
    ParametricCurve.prototype.createDraggers = function() {

        return [];
        
    };
    
    // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

})); // define

    
