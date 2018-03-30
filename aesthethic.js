/**
 * [File Information]
 * @file [aesthetic.js] (description of overall code)
 * Sample of aesthetic and readable code on Javascript
 * <I used to set a message for the others that will read this code>
 * =================================================================== 
 * [General Information]
 * @author Michael Willian Santos <email / website>
 * @version 0.0.1 
 * @tutorial link <only if there is a tutorial for this code, can be
 * a web link or filename (you set)>
 * @license MIT <link>
 * =================================================================== 
 * [Requirement Information & Reference part: Only if there is]
 * @requires foo/bar.js
 * @see reference on folder 'foo' <I do this if there is third codes 
 * on this>
 * =================================================================== 
 * [Todo Information: Useful for team or open codes. To other dudes 
 * know what to do]
 * @todo [ ] Improve this code!
 * @todo [x] Improve the aesthetic design
*/
'use strict'
import { example } from "bar";
/* ==================================================================
 Ctrl+F [localization]:
    :imported   | register this code.
    :sample     | a sample function code with better aesthetic
    :test       | a sample class code with better aesthetic

    [<symbol name> | brief description]
=================================================================== */
/**
 * @global :imported
 * @var Imported
 * @description Useful global variable to register code. You can
 * use this to check up if there is another code. 
 * @example How to check up:
 * if (Imported.hasOwnProperty("Aesthetic")) {
 *  alert("Ok");
 * }
*/
var Imported = Imported || {};
Imported.Aesthetic = Imported.Aesthetic || {};
Imported.Aesthetic.Version = 0.01;
// ==================================================================
/**
 * @global :sample
 * @function Sample
 * @description Example of function with better aesthetic 
*/
function Sample() { throw new Error('this is a static function, dude :)') };
/**
 * @function hello
 * @memberof Sample
 * @param {string} [text]
 * @description Display a alert message with a sting
 * @returns {Boolean} just example :v
*/
Sample.hello = function(text) {
    window.alert(text || "You need to set up the text, man! Don't use drugs!!");
    return true;
}
// ==================================================================
/**
 * @global :test
 * @class
 * @classdesc Example of aesthetic class
*/
class Test {
    /**
     * @constructor 
     * @param {string} [text] set up the initial value of 'string' var 
     * @description set up initial variables
    */
    constructor(text) {
        this.string = text || "";
    }
    /**
     * @function alert
     * @param {string} [text] set up a new text to var 'this.string'
     * @description Display a alert message in which contain the value
     * from 'this.string' or a new message in which you can setup.
    */
    alert(text) {
        this.string = typeof text === 'string' ? text : this.string;
        window.alert(this.string); 
    }
}
