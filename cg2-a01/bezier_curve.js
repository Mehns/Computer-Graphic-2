/*
 * Module: bezier_curve
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "bezier_dragger", "parametric_curve"],
    (function (Util, vec2, Scene, BezierDragger, ParametricCurve) {
        // "use strict"
        /**
         * a bezier curve is a parametric curve with a control polygon that can be dragged
         */
        var BezierCurve = function (p0, p1, p2, p3, segments, lineStyle) {

            //points of the control polygon
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.pointArray=[];

            // Kubische Bernstein-Polynome
            this.b0 = function (t) {
                return Math.pow(1 - t, 3);
            }

            this.b1 = function (t) {
                return 3 * Math.pow(1 - t, 2) * t;
            }

            this.b2 = function (t) {
                return 3 * (1 - t) * Math.pow(t, 2);
            }

            this.b3 = function (t) {
                return Math.pow(t, 3);
            }
            //function of bezier curve with the polygon points and polynoms
            this.bezierCurve = function (coord, t) {
                return (this.b0(t) * this.p0[coord]) + (this.b1(t) * this.p1[coord]) + (this.b2(t) * this.p2[coord]) + (this.b3(t) * this.p3[coord]);
            };

            //how many segments has the curve
            this.segments = segments || 20;
            this.tickMarks = false;
            //console.log("creating parametric curve: " +
            //"\np0 " + this.p0 +
            //"\np1 " + this.p1 +
            //"\np2 " + this.p2 +
            //"\np3 " + this.p3 +
            //"\nt_max " + this.max_t +
            //"\nt_min " + this.min_t +
            //"\nsegments " + this.segments);

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
        };

        // get the method drawCurve from ParametricCurve
        BezierCurve.prototype.drawCurve = ParametricCurve.prototype.drawCurve;
        // draw this line into the provided 2D rendering context
        BezierCurve.prototype.draw = function (context) {
            //calculating the Points
            this.pointArray=[];
            this.pointArray.push([this.p0[0], this.p0[1]]);
            for (var i = 1; i <= this.segments; i++) {
                var t = 1 / this.segments * i;
                var px = this.bezierCurve(0, t);
                var py = this.bezierCurve(1, t);
                this.pointArray.push([px, py]);
            }
            //drawing the Curve with method form parametricCurve
            this.drawCurve(context,this.pointArray,this.segments,this.tickMarks);

        };
        //checks if the user hits the curve
        BezierCurve.prototype.isHit = function (context, mousePos) {
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
        BezierCurve.prototype.createDraggers = function () {
            var draggerStyle = {radius: 4, color: "#FF0000", width: 0, fill: true}
            var draggerStyle1 = {radius: 4, color: "#123456", width: 0, fill: true}
            var draggers = [];
            // create closure and callbacks for dragger
            var _line = this;
            var getP0 = function () {
                return _line.p0;
            };
            var getP1 = function () {
                return _line.p1;
            };
            var getP2 = function () {
                return _line.p2;
            };
            var getP3 = function () {
                return _line.p3;
            };
            var setP0 = function (dragEvent) {
                _line.p0 = dragEvent.position;
                $('#P0X').val(_line.p0[0]);
                $('#P0Y').val(_line.p0[1]);
            };
            var setP1 = function (dragEvent) {
                _line.p1 = dragEvent.position;
                $('#P1X').val(_line.p1[0]);
                $('#P1Y').val(_line.p1[1]);
            };
            var setP2 = function (dragEvent) {
                _line.p2 = dragEvent.position;
                $('#P2X').val(_line.p2[0]);
                $('#P2Y').val(_line.p2[1]);
            };
            var setP3 = function (dragEvent) {
                _line.p3 = dragEvent.position;
                $('#P3X').val(_line.p3[0]);
                $('#P3Y').val(_line.p3[1]);
            };
            var points = [getP0, getP1, getP2, getP3];
            draggers.push(new BezierDragger(getP0, setP0, draggerStyle1, points));
            draggers.push(new BezierDragger(getP1, setP1, draggerStyle, points));
            draggers.push(new BezierDragger(getP2, setP2, draggerStyle, points));
            draggers.push(new BezierDragger(getP3, setP3, draggerStyle1, points));
            return draggers;
        };
        // this module only exports the constructor for Circle objects
        return BezierCurve;

})); // define

    
