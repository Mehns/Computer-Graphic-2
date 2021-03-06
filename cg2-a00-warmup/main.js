
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
"use strict";

// this shall be the function that generates a new path object
var makePath = function(div) {
	var p = "";
	var  f = function(arg){
		if (arg == undefined){
			return p;
		}
		else {
			p = p + arg + div;
			return p;
		}

		
	};
	return f;
};

// the main() function is called when the HTML document is loaded
var main = function() {

	// create a path, add a few points on the path, and print it
	var path1 = makePath("/");

	path1("A"); 
	path1("B"); 
	path1("C");

	var path2 = makePath("-->");
	path2("Rio"); 
	path2("London"); 
	path2("Tokio");

	window.console.log("path 1 is " + path1() );
	window.console.log("path 2 is " + path2() );

};
