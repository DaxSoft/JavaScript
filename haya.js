

/**
 * @file [haya.js -> Haya Core]
 * This plugin contain several tools and useful stuffs to make 
 * somethigns more easy and faster.
 * Special thanks for Fehu (Alisson)
 * =====================================================================
 * @author Dax Soft | Kvothe <www.dax-soft.weebly.com> / <dax-soft@live.com>
 * @version 0.2.7
 * @license MIT <https://dax-soft.weebly.com/legal.html>
 * =====================================================================
 * @todo [ ] Better Download way
 * @todo [ ] Better Manager for PIXI
 * @todo [ ] Finish Collision methods
 */

/*:
 * @author Dax Soft | Kvothe
 * 
 * @plugindesc Essential core for my plugins to MV. [0.2.7]
 * 
 * @help
 * Important: Insert this plugin before every Haya plugin on the list.
 */
var Imported = Imported || new Object();
var Haya = new Object();
/* ================================================================================
Ctrl+F [locate]:
    :global [global functions]
    :fileio [tools and useful stuffs for file manager]
    :utils [general tools for several things]
    :dmath [math function for stuffs]
    :touch [TouchInpit]
    :sceneManager [SceneManager]
    :piximanager [manager for PIXI function]
    :sprite [create easy sprites with PIXI]
        :picture
        :text
        :graphic
================================================================================ */

// =================================================================================
// [Global function] :global
// =================================================================================
function print(value) { console.log(value) };
// =================================================================================
// [Number: extension] :number
// =================================================================================
// isBetween
if (typeof Number.prototype.isBetween === 'undefined') {
    /**
     * @desc Check out if the value is between 'min' and 'max'
     * @param {number} min minumum value 
     * @param {number} max maximum value
     * @param {boolean} equalNo default is false
     *  [true] will check based on '<' and '>'
     *  [false] will check based on '<=' and '>='
     * @return {boolean}
     */
    Number.prototype.isBetween = function(min, max, equalNo) {
        var _isBetween = false; 
        if (equalNo) {
            if ( (this < max) && (this > min) )
                _isBetween = true; 
        } else {
            if ( (this <= max) && (this >= min) )
                _isBetween = true; 
        }
        return _isBetween;
    }
};
// isOdd
if (typeof Number.prototype.isOdd === 'undefined') {
    /**
     * @desc check out if the current value is odd
     * @return {boolean}
     */
    Number.prototype.isOdd = function() {
        return (this & 1);
    }
}
// isEven
if (typeof Number.prototype.isEven === 'undefined') {
    /**
     * @desc check out if the current value is evan
     * @return {boolean}
     */
    Number.prototype.isEven = function() {
        return !(this & 1);
    }
}
// =================================================================================
// [String: extension] :string
// =================================================================================
// isEmpty
if (typeof String.prototype.isEmpty === 'undefined') {
    /**
     * @desc check out if an string is empty
     * @return {boolean}
    */
    String.prototype.isEmpty = function() {
        return (this.length === 0 || !this.trim());
    };
};
// clean
if (typeof String.prototype.clean === 'undefined') {
    /**
     * @desc clean the string of break lines elements and empty spaces
     * @return {string}
    */
    String.prototype.clean = function() {
        return this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "");
    }
};
// =================================================================================
// [Main] :main
// =================================================================================
(function($) {
'use strict';
    // =============================================================================
    // [Global variable]: $ -> Haya
    // =============================================================================
    /**
     * @var $.alias
     * @type {object}
     * @description aliasing
     * @var $.Pixi
     * @type {function}
     * @description take care of PIXI tools
     * @var $.Pixi.TextureCache
     * @type {object}
     * @description take care of loaded textures
     * @var $.Pixi.Sprite
     * @type {function}
     * @description take care of sprite stuffs
     */
    $.alias = new Object();
    $.Pixi = function() { throw new Error('This is a static class'); };
    $.Pixi.TextureCache = new Object();
    $.Pixi.Sprite = function() { throw new Error('This is a static class'); };
    /**
     * @description some constants from Node
     * @constant fs require('fs')
     * @constant path require('path')
     * @constant https require('https)
     */
    const fs = require('fs');
    const path = require('path');
    const http = require('http');
    const https = require('https');
    // =============================================================================
    /**
     * :fileio
     * @function FileIO
     * @memberof Haya
     * @description Tools and useful stuffs to manager files
     */
    $.FileIO = function() { throw new Error('This is a static class'); }
    /**
     * @function Download
     * @memberof FileIO
     * @description Tools and useful stuffs to download things
     */
    $.FileIO.Download = function() { throw new Error('This is a static class'); }
    /**
     * @param {string} filepath local filepath to file | url;
     * @param {string} type MimeType
     * @type {string}
     * @return {string}
     */
    $.FileIO.ajax = function(filepath, type) {
        type = type || "application/json";
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", filepath, false);
        if (type && xmlHttpRequest.overrideMimeType) {
            xmlHttpRequest.overrideMimeType(type);
        }
        xmlHttpRequest.send();
        if (xmlHttpRequest.status < 400) { return xmlHttpRequest.responseText } else {
            throw new Error("Cannot load file " + filepath);
        }
    }
    /**
     * @desc read xml string and return to document
     * @param {string} filepath local filepath to file | url
     * @return {object} return to HTTLDocument 
     */
    $.FileIO.xml = function(filepath, mime) {
        var string = $.FileIO.txt(filepath);
        return (new DOMParser()).parseFromString(string,  mime || "application/xml");
    }
    /**
     * @desc read JSON file and return to object
     * @param {string} filepath local filepath to file | url
     * @return {object}
     */
    $.FileIO.json = function(filepath) { return (JSON.parse($.FileIO.ajax(filepath))); }
    /**
     * @description create json file
     * @param {object} [data]
     * @param {string} [filepath]
     * @returns {boolean}
    */
    $.FileIO.wjson = function(data, filepath) {
        if (typeof filepath !== 'string') return false;
        if (!($.Utils.isObject(data))) return false;
        filepath = /.json$/i.test(filepath) ? filepath : filepath + ".json";
        let local = $.FileIO.local(filepath);
        fs.writeFile(filepath, JSON.stringify(data, null, "\t"))
        return true;
    }
    /**
     * @desc export object to JSON file
     * @param {object} object that will be exported
     * @param {string} filepath local filepath to file | url
     */
    $.FileIO.toJson = function(object, filepath) {
        var data = JSON.stringify(object, "\t");
        if (!filepath.match(/\.json$/i)) filepath += ".json";
        fs.writeFile(filepath, data, function (err) {
            console.log(filepath, "\tcreated");
        })
    }
    /**
     * @desc read a TXT file
     * @param {string} filepath local filepath to file | url
     * @return {string}
     */
    $.FileIO.txt = function(filepath) { return ($.FileIO.ajax(filepath, "text/plain")) }
    /**
     * @desc clean the '\' of pathname
     * @param {string} pathname
     * @return {string}
     */
    $.FileIO.clean = function(pathaname) { return pathaname.replace(/(\/)[(/)]/g, '/') }
    /**
     * @desc get the local folder
     * @param {string} pathname to folders inside of 'local folder'
     * @return {string}
     */
    $.FileIO.local = function(pathname) {
        var localDirBase = path.dirname(process.mainModule.filename);
        return path.join(localDirBase, pathname);
    }
    /**
     * @desc create a new folder
     * @param {string} pathname
     * @returns {string}
     */
    $.FileIO.mkdir = function(pathname, localable) {
        if (localable) pathname = $.FileIO.local(pathname);
        if (!fs.existsSync(pathname)) fs.mkdirSync(pathname);
    }
    /**
     * @desc get the list of files from folder
     * @param {string} filepath local filepath to file | url
     * @param {function} callback function that has as argument, the filepath
     */
    $.FileIO.list = function(filepath, callback) {
        // get local folder
        filepath = $.FileIO.local(filepath);
        // folder exist?
        if (!fs.existsSync(filepath)) { console.warn("folder fon't found", filepath); return []; }
        // get
        let files = fs.readdirSync(filepath);
        // each
        let i = files.length;
        while (i--) {
            let filename = path.join(filepath, files[i]);
            let status = fs.lstatSync(filename);
            // check out if is not directory
            if (!status.isDirectory()) { callback(filename); }
        } 
        return files;
    }
    /**
     * @description recursive xml reader that transform the elements into Object
     * @param {XMLDocument} xml 
     * @returns {object}
     * @example return 
     *  {"x": { "y": [ {obj...} ] } }
     */
    $.FileIO.objXML = function (xml) {
        // return case
        if (Haya.Utils.invalid(xml)) return {};
        // check out children nodes
        if ((xml.childNodes.length > 0) && (xml.children.length < 1)) {
            // if is equal 1
            if (xml.childNodes.length === 1) return xml.childNodes[0].nodeValue;
            // data
            var data = [];
            // get each node
            var i = xml.childNodes.length;
            while (i--) {
                // item
                var item = xml.childNodes.item(i);
                data.push(item.nodeValue);
            }
            return data;
        }
        // if is XMLDocument
        if (xml instanceof XMLDocument) {
            // var
            var data = {};
            // children first
            if (xml.children.length > 0) {
                // get each children
                var i = xml.children.length;
                while (i--) {
                    // get item
                    var item = xml.children.item(i);
                    data[item.nodeName] = data[item.nodeName] || {}; // recursive
                    data[item.nodeName] = $.FileIO.objXML(item, data)
                }
            }
        } else if (xml instanceof Element) { // if is Element
            // check out children
            if (xml.children.length > 0) {
                // data
                var data = {}; 
                // get each children
                var i = xml.children.length;
                while (i--) {
                    // item
                    var item = xml.children.item(i);
                    data[item.nodeName] = data[item.nodeName] || [];
                    data[item.nodeName].push($.FileIO.objXML(item, data));
                }
            } 
        }
        // return
        return data;
    }
    /**
     * @description download the file type text
     * @param {string} url http link
     * @param {string} dest folder to save
     * @param {string} filename if is not defined will be http filename
     * @param {function} onLoad function to call when it is ready
     *                   (basename, dest + filename)
     * @returns {boolean}
     * @example
     *  Haya.FileIO.Download.txt(
     *      "http://humanstxt.org/humans.txt",
     *      "",
     *      null,
     *      function () { alert("File downloaded!") }
     *  )
     */
    $.FileIO.Download.txt = function(url, dest, filename, onLoad) {
        // return case
        if ($.Utils.invalid(url)) return false;
        // setup
        var fname = filename || path.basename(url);
        dest = $.FileIO.local(dest || "");
        $.FileIO.mkdir(dest);
        let destination = dest + "/" + fname;
        // request
        this.xhttp = new XMLHttpRequest();
        // load
        this.xhttp.onload = function() {
            fs.writeFile(destination, this.responseText);
            if ($.Utils.isFunction(onLoad)) onLoad.call(this, path.basename(destination), destination);
        }
        // open
        this.xhttp.open("GET", url, true);
        this.xhttp.send(null);
        return true;
    }
    /**
     * @description download image type
     * @param {string} url http link
     * @param {string} dest folder to save
     * @param {string} filename if is not defined will be http filename
     * @param {string} type blob type ("image/png" or "image/jpg")
     * @param {function} onLoad function to call when it is ready
     *                   (basename, dest + filename)
     * @returns {boolean}
     */
    $.FileIO.Download.img = function(url, dest, filename, type, onLoad) {
        // return case
        if ($.Utils.invalid(url)) return false;
        // setup
        var fname = filename || path.basename(url);
        dest = $.FileIO.local(dest || "");
        $.FileIO.mkdir(dest);
        let destination = dest + "/" + fname;
        // request
        this.xhttp = new XMLHttpRequest();
        let mreader = new FileReader();
        if ($.Utils.invalid(type) || String(type || "").isEmpty()) {
            if (url.match(/jpg/i)) {
                type = "jpg"
            } else if (url.match(/png/i)) {
                type = "png";
            } else {
                type = "png";
            }
        }
        // destinanation
        if (!(destination.match(/\.(\w+)$/i))) {
            destination += "." + type;
        }
        // setup
        this.xhttp.responseType = 'arraybuffer';
        this.xhttp.open('GET', url, true);
        // stage
        this.xhttp.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                let blob = new Blob([this.response], {type: String("image/" + type)});
                
                mreader.onload = function () {
                    fs.writeFile(destination, Buffer(new Uint8Array(this.result)));
                    if ($.Utils.isFunction(onLoad)) onLoad(fname, destination);
                }
                mreader.readAsArrayBuffer(blob);
            }
        }
        // send
        this.xhttp.send(null)
    }
    // =============================================================================
    /**
     * :util
     * @function Utils
     * @memberof Haya
     * @description Tools and useful stuffs to check up things.
     * 
     * @function Object
     * @memberof Utils
     * @description Tools and useful stuffs for Object
     * 
     * @function String
     * @memberof Utils
     * @description Tools and useful stuffs for String
     * 
     * @function Array
     * @memberof Utils
     * @description Tools and useful stuffs for Array
     * 
     * @function Color
     * @memberof Utils
     * @description Tools and useful stuffs for Color
     */
    $.Utils = function() { throw new Error('This is a static class'); };
    $.Utils.Object = function() { throw new Error('This is a static class'); };
    $.Utils.String = function() { throw new Error('This is a static class'); };
    $.Utils.Array = function() { throw new Error('This is a static class'); };
    $.Utils.Color = function() { throw new Error('This is a static class'); };
    /**
     * @desc check out if is object
     * @param {any}
     * @return {boolean}
     */
    $.Utils.isObject = function(type) { return (type && Object.prototype.toString.call(type) === '[object Object]'); }
    /**
     * @desc check out if is array
     * @param {any}
     * @return {boolean}
     */
    $.Utils.isArray = function(type) { return (type && Object.prototype.toString.call(type) === '[object Array]'); }
     /**
     * @desc check out if is function
     * @param {any} 
     * @return {boolean}
     */
    $.Utils.isFunction = function(type) { return (type && Object.prototype.toString.call(type) === '[object Function]'); }
    /**
     * @desc check out if is boolean type
     * @param {string} type 
     * if is 'string', will check out by:
     *  return [true] when is "true", "yes", "on"
     *  return [false] when is "false", "no", "off"
     * if is 'number', will check out by:
     *  return [true] when is 1
     *  return [false] when is 0
     * @param {boolean} booleanDefault | for default, return this param. Default is false
     * @return {boolean}
     */
    $.Utils.isBoolean = function(type, booleanDefault) {
        // if is boolean
        if (type instanceof Boolean) return type;
        // if is string
        if (type instanceof String) {
            // lowercase
            type = type.toLowerCase();
            // check out true value
            if (type.match(/^(true|yes|on|enable)/i)) return true;
            // check out false value
            if (type.match(/^(false|no|off|disable)/i)) return false;
        } else if (type instanceof Number) {
            // return true
            if (type === 1) return true;
            // return false
            if (type === 0) return false;
        }
        // default return
        return booleanDefault || false;
    }
    /**
     * @desc check out if the object is invalid (neither undefined either null)
     * @param {any} object
     * @return {boolean}
     */
    $.Utils.invalid = function(object) { 
        return (
            typeof object === 'undefined'       ||
            typeof object === 'null'             
        );
    }
    /**
     * @description check up if object is false (undefined, null, NaN, false, 0, -1)
     * @param {any} [object]
     * @returns {boolean}
    */
    $.Utils.isFalse = function(object) {
        if ($.Utils.invalid(object) || object === NaN || object === 0 || object === -1 || object === false) return true;
        return false;
    }
    /**
     * @description check up if object is true (undefined, null, NaN, false, 0, -1)
     * @param {any} [object]
     * @returns {boolean}
    */
    $.Utils.isTrue = function (object) {
        return (!($.Utils.isFalse(object))); 
    }
    /**
     * @desc get index by propriety of object
     * @param {object} object that will be checked
     * @param {string} propriety that will be checked
     * @param {string} value -> that will be found and return to his index;
     */
    $.Utils.Object.index = function(object, propriety, value) {
        object.map(function (element) { 
            return element[propriety];
        }).indexOf(value);
    };
    /**
     * @desc return the next element from 'object'
     * @param {object} object
     * @param {string} current keyname
     * @return {*} 
     */
    $.Utils.Object.next = function(object, current) {
        var next  = (Object.keys(object).indexOf(current) + 1) % Object.keys(object).length;
        console.log(object[Object.keys(object)[next]], next)
        return object[Object.keys(object)[next]];
    }
    /**
     * @desc return the previous element from 'object'
     * @param {object} 
     * @param {string} current keyname
     * @return {*}
     */
    $.Utils.Object.pred = function(object, current) {
        var pred  = (Object.keys(object).indexOf(current) - 1) % Object.keys(object).length;
        return object[Object.keys(object)[pred]];
    }
    /**
     * @desc merge into 'object' another 'object' and return to a new Object
     * @param {object} object that will receive the merge
     * @param {object} mobject that will be merged
     * @param {boolean} replace replace elements that 'object' have. Default is [true]
     * @return {obejct}
     */
    $.Utils.Object.merge = function(object, mobject, replace) {
        // replace 
        replace = replace || true;
        // new object
        var nobject = new Object(); 
        // check out if object and mobject is Object
        if (!$.Utils.isObject(object) || !$.Utils.isObject(mobject)) return nobject;
        // merge function
        Object.keys(object).map(function (keyname) { // each keyname from mobject
            // check out if mobject has the keyname
            if (mobject.hasOwnProperty(keyname)) {
                // check out if the value is a Object
                if ($.Utils.isObject(mobject[keyname])) {
                    nobject[keyname] = $.Utils.merge(
                        object[keyname],
                        $.Utils.merge(object[keyname], mobject[keyname], replace),
                        replace	
                    );
                } else {
                    nobject[keyname] = replace ? mobject[keyname] : object[keyname];
                }
            } else {
                nobject[keyname] = object[keyname]
            }
        })
        // return to new object based on 'object' and 'mobejct'
        return nobject;
    }
    /**
     * @description Iterate through the properties of any object.
     * @param {Object} [object] Iterate through the properties of any object.
     * @param {!function(this:scope, keyname, value, index, object)} [callback]
     * @param {any} [scope] use as scope for 'callback'. If don't set up is by default, the object.
     * @returns {Object}
     */
    $.Utils.Object.each = function(object, callback, scope) {
        // check out if object is Object
        if (!($.Utils.isObject(object))) return {};
        // get each keys
        this.keys = [];
        for (kobj in object) { this.keys.push(kobj); }
        // get into each properties from object
        let i = this.keys.length;
        while (i--) {
            if (object.hasOwnProperty(this.keys[i])) {
                // check out if is function
                if ($.Utils.isFunction(callback)) {
                    callback.apply(
                        scope || object,
                        this.keys[i],
                        object[this.keys[i]],
                        i, 
                        object
                    );
                }
            }
        }
        // return
        return object;
    }
    /**
     * @description capitalize [automatic punctuation]
     * @param {string} [string]
     * @returns {string}
     */
    $.Utils.String.capitalize = function(string) {
        return string.replace(/(^|\. *)([a-z])/g, function (result, separator, char) {
            return (separator + char.toUpperCase());
        });
    }
    /**
     * @description check out if array contain X element
     * @param {array} [array] 
     * @param {element} [element]
     * @returns {boolean}
     */
    $.Utils.Array.contain = function(array, element) {
        return (array.indexOf(element) === -1 ? false : true);
    }
    /**
     * @description get a random element from array
     * @param {array} [array]
     * @param {number} [at] (optional, default is 0) 
     * at the element index until 'end'
     * @param {number} [end] (optional, default is length) 
     * until 'end' element index.
     * @returns {boolean}
     */
    $.Utils.Array.random = function(array, at, end) {
        at = at || 0;
        end = end || array.length;
        return array[$.DMath.randInt(at, end - 1)];
    }
    /**
     * @description check up if all element on Array is false. Will only
     * check out elements that is Boolean type.
     * This is useful only if the array has elements that isn't boolean type.
     * Otherwise, you can use the function 'every' from Array. Vanilla method.
     * @see $.Utils.isBoolean();
     * @param {array} [array]
     * @param {*} [scope] by default is [array]
     * @param {!function(this:scope, array)} [callback]
     * @returns {Boolean}
     *  [true] if every value is false
     *  [false] if isn't
     */
    $.Utils.Array.isFalse = function(array, callback, scope) {
        // get each 'boolean' element
        this.boolean = [];
        let i = array.length;
        while (i--) {
            if ($.Utils.isBoolean(array[i], -1) !== -1) {
                this.boolean.push($.Utils.isBoolean(array[i]));
                callback.call(scope || array, array[i]);
            } 
        }
        // return
        return this.boolean.every(function (el) { return el === false; })
    }
    /**
     * @description check up if all element on Array is true. Will only
     * check out elements that is Boolean type.
     * This is useful only if the array has elements that isn't boolean type.
     * Otherwise, you can use the function 'every' from Array. Vanilla method.
     * @see $.Utils.isBoolean();
     * @param {array} [array]
     * @param {*} [scope] by default is [array]
     * @param {!function(this:scope, array)} [callback]
     * @returns {Boolean}
     *  [true] if every value is true
     *  [false] if isn't
     */
    $.Utils.Array.isTrue = function(array, callback, scope) {
        return (!($.Utils.Array.isFalse(array, callback, scope)));
    }
    /**
     * @description expand a array until 'limit' by following the 
     * 'step' value.
     * @example 
     *  Haya.Utils.Array.step(0, 10, 2) // [0, 2, 4, 6, 8, 10];
     * @param {number} [start]
     * @param {number} [end]
     * @param {number} [step] will divide the limit
     * @param {!function(this:scope, element, start, end, step, array)} [callback] 
     * @param {*} [scope] by default is [array]
     * @returns {array}
     */
    $.Utils.Array.step = function(start, end, step, callback, scope) {
        // checkup
        start = start || 0;
        step = step || 1;
        // into
        for (let array = []; (end - start) * step > 0; start += step) {
            array.push(start);
            callback.call(scope || array, array.pop(), start, end, step, array);
        }
        return array;
    }
    /**
     * @description get a random color
     * @return {string} <hex>
    */
    $.Utils.Color.random = function() {
        let random = (Math.random() * 0x1000000 << 0).toString(16);
        let array = new Array(7 - random.length).join("0") + random;
        return String("#" + array);
    }
    // =============================================================================
    /**
     * :dmath
     * @function DMath
     * @memberof Haya
     * @desc tools for calcs
     * 
     * @function Position
     * @memberof DMath
     * @desc tools for positions calcs
     * 
     * @function Vector
     * @memberof DMath
     * @description Tool for Vector classes
     */
    $.DMath = function() { throw new Error('This is a static class'); };
    $.DMath.Position = function() { throw new Error('This is a static class'); };
    $.DMath.Vector = function() { throw new Error('This is a static class'); };
    /**
     * @desc turn value to percent by max
     * @param {number, number, number}
     * @return {number}
     */
    $.DMath.percentTo = function(current, min, max) { return ((current * min) / max); }
    /**
     * @desc turn value to percent
     * @param {number, number}
     * @return {number}
     */
    $.DMath.toPercent = function(current, min) { return ((current * min) / 100); }
    /**
     * @desc get a random numeric between a min and max value.
     * @param {number, number}
     * @return {number}
     */
    $.DMath.rand = function(min, max) { return Math.random() * (max - min) + min; }
    /**
     * @desc get a random numeric between a min and max value with integer value.
     * @param {number, number}
     * @return {number}
     */
    $.DMath.randInt = function(min, max) {
        min = Math.ceil(min); max = Math.floor(max);
        return ~~(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @desc get a randomic variation of a number
     * @param {number, number}
     * @return {number}
     */
    $.DMath.randomic = function(current, variation) {
        let random = $.DMath.randInt(0, 1) === 0 ? $.DMath.rand(0, variation) : -$.DMath.rand(0, variation);
        current = (current + $.DMath.rand(0, 2)) + (current + random);
        return (Math.round(current) / 2);
    } 
    /**
     * @description catch up the distance between 2 number and return
     * the absolute value
     * @param {number} [x]
     * @param {number} [y]
     * @returns {number}
     */
    $.DMath.distance = function (x, y) {
        return Math.abs(x - y);
    }
    /**
     * @description Converts from radians to degrees.
     * @param {number} [radians]
     * @example 
     * Haya.DMath.degrees(~1.570) // 90
     * @returns {number}
     */
    $.DMath.degrees = function(radians) { return (radians * 180 / Math.PI); };
    /**
     * @description Converts from degrees to radians.
     * @param {number} [degrees]
     * @example 
     * Haya.DMath.radians(90) // ~1.570
     * @returns {number}
     */
    $.DMath.radians = function(degrees) { return (degrees * Math.PI / 180); };
    /**
     * @description Iterates over 'start' numeric value until 'end' 
     * numeric value.
     * @param {number} [start] initial value, Math.trunc is used
     * @param {number} [end] end value, Math.trunc is used
     * @param {*} [scope] used on callback
     * @param {!function(this:scope, current, start, end, array)} [callback]
     * @returns {array}
     */
    $.DMath.upto = function(start, end, callback, scope) {
        this.array = [];
        let i = Math.trunc(start);
        while (i <= Math.trunc(end)) {
            this.array.push(i);
            callback.call(scope || this, i, Math.trunc(start), Math.trunc(end), array);
        }
        return this.array;
    }
    /**
     * @description Iterates over 'end' numeric value until 'start' 
     * numeric value. Reverse of 'upto'
     * @param {number} [end] end value, Math.trunc is used
     * @param {number} [limit] end down to until 'limit'
     * @param {*} [scope] used on callback
     * @param {!function(this:scope, current, limit, end, array)} [callback]
     * @returns {array}
     */
    $.DMath.downto = function(end, limit, callback, scope) {
        this.array = [];
        let i = Math.trunc(end);
        while (i--) {
            this.array.push(i);
            callback.call(scope || this, i, Math.trunc(limit), Math.trunc(end), array);
            if (i === Math.trunc(limit)) break;
        }
        return this.array;
    }
    /**
     * @desc display object based on screen
     * @param {object} hash that contains:
     *      type: [type of position],
     *      object: [this class need to have width & height function],
     *      [optional] width: [width of object, case don't have]
     *      [optional] height [height of object, case don't have]
     * @return {Point}
     */
    $.DMath.Position.screen = function(hash) {
        // default position 
        let point = new Point(0, 0);
        let width = hash.object === undefined ? hash.width : hash.object.width;
        let height = hash.object === undefined ? hash.height : hash.object.height;
        // condition
        if (hash.type === "center" || hash.type === "c" || hash.type === 0 ) {
            point.x = (Graphics.boxWidth - width) / 2;
            point.y = (Graphics.boxHeight - height) / 2;
        } else if (hash.type === "centerLeft" || hash.type === "cl" || hash.type === 1) {
            point.x = (Graphics.boxHeight - height) / 2;
            point.y = (Graphics.boxHeight - height) / 2;
        } else if (hash.type === "centerRight" || hash.type === "cr" || hash.type === 2) {
            point.x = Graphics.boxWidth - width;
            point.y = (Graphics.boxHeight - height) / 2;
        } else if (hash.type === "centerTop" || hash.type === "ct" || hash.type === 3) {
            point.x = (Graphics.boxWidth - width) / 2;
        } else if (hash.type === "centerBottom" || hash.type === "cb" || hash.type === 4) { 
            point.x = (Graphics.boxWidth - width) / 2;
            point.y = Graphics.boxHeight - height;
        } else if (hash.type === "upperRight" || hash.type === "ur" || hash.type === 5) { 
            point.x = Graphics.boxWidth - width;
        } else if (hash.type === "bottomRight" || hash.type === "br" || hash.type === 6) {
            point.x = Graphics.boxWidth - width;
            point.y =  Graphics.boxHeight - height;
        } else if (hash.type === "bottomLeft" || hash.type === "bf" || hash.type === 7) {
            point.y =  Graphics.boxHeight - height;
        } 
        // return default if nothing is setup
        return point;
    }
    /**
     * @desc display object based on another obejct
     * @param {object} hash that contains:
     *      type: [type of position],
     *      a: [first object, that will change the position |need to have x, y, width, height|]
     *      b: [second object, that will be the reference point |need to have x, y, width, height|]
     * @return {Point}
     */
    $.DMath.Position.sprite = function(hash) {
        // default position 
        let point = new Point(hash.a.x, hash.a.y);
        // type
        if (hash.type === "center" || hash.type === "c" || hash.type === 0 ) {
            point.x = hash.b.x + ((hash.b.width - hash.a.width) / 2);
            point.y = hash.b.y + ((hash.b.height - hash.a.height) / 2);
        } else if (hash.type === "centerLeft" || hash.type === "cl" || hash.type === 1) {
            point.x = hash.b.x;
            point.y = hash.b.y + (hash.b.height - hash.a.height) / 2;
        } else if (hash.type === "centerRight" || hash.type === "cr" || hash.type === 2) {
            point.x = hash.b.x + hash.a.width;
            point.y = hash.b.y + (hash.b.height - hash.a.height) / 2;
        } else if (hash.type === "centerTop" || hash.type === "ct" || hash.type === 3) {
            point.x = hash.b.x + (hash.b.width - hash.a.width) / 2;
            point.y = hash.b.y;
        } else if (hash.type === "centerBottom" || hash.type === "cb" || hash.type === 4) { 
            point.x = hash.b.x + (hash.b.width - hash.a.width) / 2;
            point.y = hash.b.y + hash.b.height;
        } else if (hash.type === "upperRight" || hash.type === "ur" || hash.type === 5) { 
            point.x = hash.b.x + hash.b.width;
            point.y = hash.b.y - hash.b.height;
        } else if (hash.type === "upperLeft" || hash.type === "ul" || hash.type === 6) { 
            point.x = hash.b.x;
            point.y = hash.b.y - hash.b.height;
        } else if (hash.type === "bottomRight" || hash.type === "br" || hash.type === 7) {
            point.x = hash.b.x + hash.b.width;
            point.y = hash.b.y + hash.b.height;
        } else if (hash.type === "bottomLeft" || hash.type === "bf" || hash.type === 8) {
            point.x = hash.b.x;
            point.y = hash.b.y + hash.b.height;
        } 
        // return
        return point;
    }
    /**
     * @class D2
     * @classdesc A simple and useful Vector 2D class
     * @memberof Vector
     */
    $.DMath.Vector.D2 = class {
        /**
         * @constructor
         * @param {number} [x] axis
         * @param {number} [y] axis
         */
        constructor (x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * @description sum to another vector class
         * @param {Vector.D2|Point|Array} [vector] If is number then will
         * add the number toward the x and y axis.
         * @returns {Vector.D2}
         */
        add(vector) {
            if ($.Utils.isArray(vector)) { vector = new Point(vector.shift(), vector.pop()); }
            if (typeof vector === 'number') { vector = new Point(vector, vector) };
            return new $.DMath.Vector.D2(this.x + vector.x, this.y + vector.y);
        }
        /**
         * @description substract to another vector class
         * @param {Vector.D2|Point|Array} [vector] If is number then will
         * add the number toward the x and y axis.
         * @returns {Vector.D2}
         */
        sub(vector) {
            if ($.Utils.isArray(vector)) { vector = new Point(vector.shift(), vector.pop()); }
            if (typeof vector === 'number') { vector = new Point(vector, vector) };
            return new $.DMath.Vector.D2(this.x - vector.x, this.y - vector.y);
        }
        /**
         * @description multiply to another vector class
         * @param {Vector.D2|Point|Array} [vector] If is number then will
         * add the number toward the x and y axis.
         * @returns {Vector.D2}
         */
        mult(vector) {
            if ($.Utils.isArray(vector)) { vector = new Point(vector.shift(), vector.pop()); }
            if (typeof vector === 'number') { vector = new Point(vector, vector) };
            return new $.DMath.Vector.D2(this.x * vector.x, this.y * vector.y);
        }
        /**
         * @description divide to another vector class
         * @param {Vector.D2|Point|Array} [vector] If is number then will
         * add the number toward the x and y axis.
         * @returns {Vector.D2}
         */
        div(vector) {
            if ($.Utils.isArray(vector)) { vector = new Point(vector.shift(), vector.pop()); }
            if (typeof vector === 'number') { vector = new Point(vector, vector) };
            vector.x = vector.x === 0 ? 1 : vector.x;
            vector.y = vector.y === 0 ? 1 : vector.y;
            return new $.DMath.Vector.D2(this.x / vector.x, this.y / vector.y);
        }
        /**
         * @description get a dot point based on vector
         * @param {Vector.D2|Point|Array} [vector]
         * @returns {numeric}
         */
        dot(vector) {
            if ($.Utils.isArray(vector)) { vector = new Point(vector.shift(), vector.pop()); }
            if (typeof vector === 'numeric') { vector = new Point(vector, vector) };
            return this.x * vector.x + this.y * vector.y;
        }
        /**
         * @description get the length
         */
        length() {
            return Math.sqrt(this.dot(this));
        }
        /**
         * @description check up if is equals toward another
         * vector
         * @param {Vector.D2} [vector] 
         * @returns {Boolean}
         */
        equals(vector) {
            if (vector instanceof $.DMath.Vector.D2) {
                return (this.x === vector.x && this.y === vector.y);
            }
            return false;
        }
        /**
         * @description get the magnitude value from axis position
         * @returns {numeric}
         */
        magnitude() {
            return (Math.sqrt((this.x * this.x) + (this.y * this.y)));
        }
        /**
         * @description normalize the axis scale
         * @returns {boolean}
         */
        normalize() {
            if (this.x === 0 || this.y === 0) return false;
            length = this.magnitude();
            this.x /= length;
            this.y /= length;
            return true;
        }
        /**
         * @description get a new Vector.D2 based on
         * normalize value
         * @returns {Vector.D2}
         */
        normalized() {
            return (new $.DMath.Vector.D2(this.x, this.y).normalize());
        }
        /**
         * @description scale the value
         * @param {Point|Vector.D2|Array} [sc] anything that has '.x' and '.y'
         * or a array with two elements.
         */
        scale(sc) {
            if ($.Utils.isArray(sc)) {
                sc = new Point(sc.shift(), sc.pop());
            }
            this.x *= sc.x;
            this.y *= sc.y;
        }
        /**
         * @description set a new axis value
         * @param {Point|Vector.D2|Array} [sc] anything that has '.x' and '.y'
         * or a array with two elements.
         */
        set(sc) {
            if ($.Utils.isArray(sc)) {
                sc = new Point(sc.shift(), sc.pop());
            }
            this.x = sc.x;
            this.y = sc.y;
        }
        /**
         * @description clone the class
         * @returns {Vector.D2}
         */
        clone() {
            return (new $.DMath.Vector.D2(this.x, this.y));
        }
        /**
         * @description return a perpendicular vector class
         * @returns {Vector.D2} 
         */
        perpendicular() {
            return (new $.DMath.Vector.D2(this.y, -(this.x)));
        }
        /**
         * @description get the negative version of this vector class
         * @returns {Vector.D2} 
         */
        negative() {
            return new $.DMath.Vector.D2(-this.x, -this.y);
        }
        /**
         * @description to angles
         * @returns {numeric}
         */
        toa() {
            return -Math.atan2(-this.y, this.x);
        }
        /**
         * @description get angles into
         * @param {Vector.D2} [vector]
         * @returns {numeric}
         */
        ato(vector) {
            return Math.acos(this.dot(vector) / (this.length() * vector.length()));
        }
    }
    /**
     * @description return the angle between 2 vector 2d.
     * @param {Vector.D2} [to]
     * @param {Vector.D2} [from]
     * @returns {Numeric}
     */
    $.DMath.Vector.angle2d = function (to, from) {
        return $.DMath.degrees(Math.atan2(to.y - from.y, to.x - from.x));
    }
    /**
     * @description compare to vector 2d class and return with
     * the minimum value
     * @param {Vector.D2} [from]
     * @param {Vector.D2} [to]
     * @returns {Vector.D2}
     */
    $.DMath.Vector.min2d = function (from, to) {
        return (new $.DMath.Vector.D2(
            Math.min(from.x, to.x),
            Math.min(from.y, to.y)
        ));
    }
    /**
     * @description compare to vector 2d class and return with
     * the maximum value
     * @param {Vector.D2} [from]
     * @param {Vector.D2} [to]
     * @returns {Vector.D2}
     */
    $.DMath.Vector.max2d = function (from, to) {
        return (new $.DMath.Vector.D2(
            Math.max(from.x, to.x),
            Math.max(from.y, to.y)
        ));
    }
    /**
     * @description get the cross product between two vector 2d class
     * @see https://en.wikipedia.org/wiki/Cross_product
     * @param {Vector.D2} [from]
     * @param {Vector.D2} [to]
     * @returns {Numeric}
     */
    $.DMath.Vector.cross2d = function (from, to) {
        return from.x * to.y - from.y * to.x;
    }
    /**
     * @description get the dot product between two vector 2d class
     * @see https://en.wikipedia.org/wiki/Dot_product
     * @param {Vector.D2} [from]
     * @param {Vector.D2} [to]
     * @returns {Numeric}
     */
    $.DMath.Vector.dot2d = function (from, to) {
        return from.x * to.x + from.y * to.y;
    }
    /**
     * @see https://github.com/evanw/lightgl.js/blob/master/src/vector.js
     * @class
     * @classdesc A simple and useful vector 3d class
     * @memberof Vector
     */
    $.DMath.Vector.D3 = class {
        /**
         * @constructor 
         * @param {number} [x] axis
         * @param {number} [y] axis
         * @param {number} [z] depth
         */
        constructor (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        /**
         * @description return a new vector 3d class based
         * on negative values
         * @returns {Vector.D3} 
         */
        negative() {
            return new $.DMath.Vector.D3(-this.x, -this.y, -this.z);
        }
        /**
         * @description add values (sum) into this class
         * based on another vector class
         * @param {Vector.D3|Number} [vector]
         * @returns {Vector.D3}
         */
        add(vector) {
            if (vector instanceof $.DMath.Vector.D3) {
                return new $.DMath.Vector.D3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
            } else if (typeof vector === 'number') {
                return new $.DMath.Vector.D3(this.x + vector, this.y + vector, this.z + vector);
            } else {
                this;
            }
        }
        /**
         * @description subtract values (sum) into this class
         * based on another vector class
         * @param {Vector.D3|Number} [vector]
         * @returns {Vector.D3}
         */
        sub(vector) {
            if (vector instanceof $.DMath.Vector.D3) {
                return new $.DMath.Vector.D3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
            } else if (typeof vector === 'number') {
                return new $.DMath.Vector.D3(this.x - vector, this.y - vector, this.z - vector);
            } else {
                this;
            }
        }
        /**
         * @description multiply values (sum) into this class
         * based on another vector class
         * @param {Vector.D3|Number} [vector]
         * @returns {Vector.D3}
         */
        mult(vector) {
            if (vector instanceof $.DMath.Vector.D3) {
                return new $.DMath.Vector.D3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
            } else if (typeof vector === 'number') {
                return new $.DMath.Vector.D3(this.x * vector, this.y * vector, this.z * vector);
            } else {
                this;
            }
        }
        /**
         * @description divide values (sum) into this class
         * based on another vector class
         * @param {Vector.D3|Number} [vector]
         * @returns {Vector.D3}
         */
        div(vector) {
            if (vector instanceof $.DMath.Vector.D3) {
                vector.x = vector.x === 0 ? 1 : vector.x;
                vector.y = vector.y === 0 ? 1 : vector.y;
                vector.z = vector.x === 0 ? 1 : vector.z;
                return new $.DMath.Vector.D3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
            } else if (typeof vector === 'number') {
                vector = vector === 0 ? 1 : vector;
                return new $.DMath.Vector.D3(this.x / vector, this.y / vector, this.z / vector);
            } else {
                this;
            }
        }
        /**
         * @description check out if the values is equal to another
         * vector class
         * @param {Vector.D3} [vector]
         * @returns {Boolean}
         */
        equals(vector) {
            return this.x == vector.x && this.y == vector.y && this.z == vector.z;
        }
        /**
         * @description get the dot product based on another vector
         * @param {Vector.D3} [vector]
         * @returns {Number}
         */ 
        dot(vector) {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        }
        /**
         * @description get the cross product based on another vector
         * @param {Vector.D3} [vector]
         * @returns {Vector.D3}
         */
        cross(vector) {
            return new $.DMath.Vector.D3(
                this.y * vector.z - this.z * vector.y,
                this.z * vector.x - this.x * vector.z,
                this.x * vector.y - this.y * vector.x
            );
        }
        /**
         * @description get the length from this class
         * @returns {Number}
         */
        length() {
            return Math.sqrt(this.dot(this));
        }
        /**
         * @description unit all values from this class into
         * one
         * @returns {Vector.D3}
         */
        unit() {
            return (this.div(this.length()));
        }
        /**
         * @description get the minimum value based on z
         * @returns {Number}
         */
        min() {
            return Math.min(Math.min(this.x, this.y), this.z);
        }
        /**
         * @description get the maximum value based on z
         * @returns {Number}
         */
        max() {
            return Math.max(Math.max(this.x, this.y), this.z);
        }
        /**
         * @description get the phi angle
         * @returns {Number}
         */
        phi() {
            return Math.asin(this.y / this.length());
        }
        /**
         * @description get the theta angle
         * @returns {Number}
         */
        theta() {
            return Math.atan2(this.z, this.x);
        }
        /**
         * @description angle into... based on another vector
         * @returns {Number}
         */
        ato(vector) {
            return Math.acos(this.dot(vector) / (this.length() * vector.length()));
        } 
        /**
         * @description clone this class
         * @returns {Vector.D3}
         */
        clone() {
            new $.DMath.Vector.D3(this.x, this.y, this.z);
        }
    }
    /**
     * @description cross produtc between vector 3d class
     * @param {Vector.D3} [a]
     * @param {Vector.D3} [b]
     * @param {Vector.D3} [c]
     * @returns {Vector.D3}
     */
    $.DMath.Vector.cross3d = function (a, b, c) {
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    }
    /**
     * @description unifique values
     * @param {Vector.D3} [a]
     * @param {Vector.D3} [b]
     * @returns {Vector.D3}
     */
    $.DMath.Vector.unit3d = function (a, b) {
        let length = a.length();
        b.x = a.x / length;
        b.y = a.y / length;
        b.z = a.z / length;
        return b;
    }
    /**
     * @description create a vector based on angles
     * @param {Number} [theta]
     * @param {Number} [phi]
     * @returns {Vector.D3}
     */
    $.DMath.Vector.fangle3d = function (theta, phi) {
        return new $.DMath.Vector.D3(
            Math.cos(theta) * Math.cos(phi), 
            Math.sin(phi), 
            Math.sin(theta) * Math.cos(phi));
    }
    /**
     * @description create a random vector based on angles
     * @returns {Vector.D3}
     */
    $.DMath.Vector.rand3d = function () {
        return $.DMath.Vector.fangle3d(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    }
    /**
     * @description create a vector based on minimum value between two 
     * vectors
     * @param {Vector.D3} [a]
     * @param {Vector.D3} [b]
     * @returns {Vector.D3}
     */
    $.DMath.Vector.min3d = function (a, b) {
        return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    /**
     * @description create a vector based on maximum value between two 
     * vectors
     * @param {Vector.D3} [a]
     * @param {Vector.D3} [b]
     * @returns {Vector.D3}
     */
    $.DMath.Vector.max3d = function (a, b) {
        return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    /**
     * @description Linearly interpolates between two vectors.
     * @param {Vector.D3} [a]
     * @param {Vector.D3} [b]
     * @param {Number} [fraction] nterpolates between from and to by amount 'fraction'.
     * @returns {Vector.D3}
     */
    $.DMath.Vector.lerp = function (a, b, fraction) {
        return b.sub(a).mult(fraction).add(a);
    }
    /**
     * @description between angles of two vectors
     * @param {Vector.D3} [a]
     * @param {Vector.D3} [b]
     * @returns {Vector.D3}
     */
    $.DMath.Vector.bangle = function (a, b) {
        return a.ato(b);
    }
    // ============================================================================= 
    // [TouchInput] :touch
    // =============================================================================
    /**
     * @desc remove the limit to check out the position of mouse
     * @type {Snippet}
     * @return {function}
     */
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
    // ============================================================================= 
    // [SceneManager] :sceneManager
    // ============================================================================= 
    /**
     * @desc check out if the current scene is
     * @type {Snippet}
     * @param {string} name 
     * @return {boolean}
     */
    SceneManager.prototype.isScene = function(name) { return SceneManager._scene && SceneManager._scene.constructor === name; }
    // ============================================================================= 
    /**
     * :piximanager
     * @function Pixi.Manager
     * @memberof Haya.Pixi
     * @desc manager for some functios toward PIXI
     */
    $.Pixi.Manager = function() { throw new Error('This is a static class'); } 
    /**
     * @desc load texture using PIXI
     * @param {object} request that:
     *      keyname shall be the ID to '$.Pixi.Manager.cache(id)'
     *      value shall be the filepath to load the texture
     * @return {boolean}
     */
    $.Pixi.Manager.load = function(request) {
        // return
        if (!$.Utils.isObject(request)) return false;
        // loader
        var loader = loader || new PIXI.loaders.Loader();
        // add
        for (name in request) {
            let pathname = request[name];
            if (!$.Pixi.TextureCache.hasOwnProperty(name)) {
                loader.add({
                    name: name,
                    url: pathname
                });
            } 
        }
        // load
        loader.load(function (ld, resource) {
            for (let name in resource) {
                $.Pixi.TextureCache[name] = resource[name].texture;
            }
        })
        return true;
    }
    /**
     * @desc Rreturn to texture cache by ID | setup on '$.Pixi.Manager.load'
     * @param {string} 
     * @return {*} 
     *  return to PIXI.Texture
     *  if don't exist, return to empty.
     */
    $.Pixi.Manager.cache = function(id) {
        if ($.Pixi.TextureCache.hasOwnProperty(id)) {
            return $.Pixi.TextureCache[id];
        } else {
            return PIXI.Texture.EMPTY;
        }
    }
    // =============================================================================
    /** 
     * :sprite
     * @class 
     * @function Base
     * @memberof $.Pixi.Sprite
     * @classdesc Base class for 'Sprite' manager based on PIXI.
    */
    $.Pixi.Sprite.Base = class extends PIXI.Container {
        /**
         * @constructor
         * @param {stage} stage 
         *  [setup here what stage function will take in your children, default: current scene]
         * @param {function} callback
         *  [calls after the load]
        */
        constructor(stage, callback) {
            this.stage = stage || SceneManager._scene;
            this.callback = callback;
            this.setup();
            this.load();
            if ($.Utils.isFunction(this.callback)) this.callback.apply(this, arguments);
        }
        /**
         * @function setup
         * @description default setup of sprite
         */
        setup() {
            this._x = 0; this._y = 0;
            this._loaded = false;
            this._update = null;
            this.mouse = {
                x: 0, y: 0, active: false,
                over: null, out: null, 
                trigger: {on: null, off: null},
                press: {on: null, off: null},
                repeat: {on: null, off: null},
                drag: {active: false, start: false, on: null}
            };
        }
        /**
         * @function load
         * @description load the sprite.
         */
        load() {
            // after load
            this.stage.addChild(this.sprite);
            this.sprite.renderable = true;
            this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
            this._loaded = true;
        }
        /**
         * @function dispose
         * @description destroy the sprite
         */
        dispose(destroy) {
            if (this._loaded) {
                this.sprite.destroy(destroy);  
            }
        }
        /**
         * @function update
         * @description update the sprite
         */
        update() {
            // return if is not loaded
            if (this._loaded === false) return;
            // update hit area
            this.sprite.hitArea.x = this.sprite.x;
            this.sprite.hitArea.y = this.sprite.y;
            this.sprite.hitArea.width = this.sprite.width;
            this.sprite.hitArea.height = this.sprite.height;
            // render
            this.sprite.updateTransform();
            Graphics.render(this.sprite);
            // check up if the mouse is active and the sprite is visible
            if (this.sprite.visible && this.mouse.active) {
                // get the mouse position
                this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
                this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
                this.updateMouse();
            }
            // _update
            if ($.Utils.isFunction(this._update)) this._update.apply(this, arguments);
        }
        /**
         * @function position
         * @description display the sprite toward the screen based on $.DMath.Position.screen
         * @see $.DMath.Position.screen
         * @param {string, number} type
         */
        position(type) {
            let _position = $.DMath.Position.screen({type: type, object: this.sprite});
            this.sprite.x = _position.x;
            this.sprite.y = _position.y;
        }
        /**
         * @function mirror
         * @description invert sprite (x or y)
         * @param {boolean} type
         *  [true] will invert by X axis
         *  [false] will invert by Y axis
         * @param {number} point to anchor set 
         */
        mirror(type, point) {
            point = point || 1;
            type  = type  || 0;
            if (type) {
                this.sprite.anchor.x = point; /* 0 = top, 0.5 = center, 1 = bottom */
                this.sprite.scale.x *= -1;
            } else {
                this.sprite.anchor.y = point; /* 0 = top, 0.5 = center, 1 = bottom */
                this.sprite.scale.y *= -1;
            }
        }
        /**
         * @function mouseOver
         * @description check out if mouse is over sprite (based on hitArea)
         * @returns {Boolean} 
         */
        mouseOver() {
            if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
            if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
                if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                    return true;
                }
            }
            return false; 
        }
        /**
         * @function updateMouse
         * @description update the mouse functions if is active
         */
        updateMouse() {
            // check out if the mouse is over or not
            if (this.mouseOver()) {
                // function that will be call
                if ($.Utils.isFunction(this.mouse.over)) this.mouse.over.apply(this);
                // check out if was triggered inside
                if (TouchInput.isTriggered() && $.Utils.isFunction(this.mouse.trigger.on)) this.mouse.trigger.on.apply(this);
                // check out if was pressed inside
                if (TouchInput.isLongPressed()) {
                    if (!this.mouse.drag.active) {
                        if ($.Utils.isFunction(this.mouse.press.on)) this.mouse.press.on.apply(this);
                    } else {
                        if ($.Utils.isFunction(this.mouse.drag.on)) this.mouse.drag.on.apply(this);
                        this.sprite.x = this.mouse.x - ( ( (this.sprite.hitArea.width) ) / 2 )
                        this.sprite.y = this.mouse.y - ( ( (this.sprite.hitArea.height) ) / 2 )
                    }
                } else {
                    if (this.mouse.drag.active)  this.mouse.drag.start = false;
                }
                // check out if was repeated inside
                if (TouchInput.isRepeated() && $.Utils.isFunction(this.mouse.repeat.on)) this.mouse.repeat.on.apply(this);
            } else {
                // function that will be call
                if ($.Utils.isFunction(this.mouse.out)) this.mouse.out.apply(this);
                // check out if was triggered inside
                if (TouchInput.isTriggered() && $.Utils.isFunction(this.mouse.trigger.off)) this.mouse.trigger.off.apply(this);
                // check out if was pressed inside
                if (TouchInput.isLongPressed() && $.Utils.isFunction(this.mouse.press.off)) this.mouse.press.off.apply(this);
                // check out if was repeated inside
                if (TouchInput.isRepeated() && $.Utils.isFunction(this.mouse.repeat.off)) this.mouse.repeat.off.apply(this);
            }
        }
    }
    /**
     * :picture
     * @class
     * @function Picture
     * @memberof $.Pixi.Sprite
     * @classdesc class to manager picture pixi based on $.Pixi.Sprite.Base
     */
    $.Pixi.Sprite.Picture = class extends $.Pixi.Sprite.Base {
        /**
         * @constructor
         * @param {object} hash
         *  {stage} stage: stage that will get this children
         *  {texture} texture: texture to display 
         * @param {function} callback
         *  [calls after the load]
         */
        constructor(hash, callback) {
            this.hash = hash;
            super.constructor.call(this, this.hash.stage, callback);
        }
        /**
         * @function load
         * @description load the texture
         */
        load() {
            this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
            // there is texture?
            if (this.hash.texture) this.sprite.texture = this.hash.texture;
            // after load
            super.load.call(this);
        }
    }
    /**
     * :text
     * @class
     * @function Text
     * @memberof $.Pixi.Sprite
     * @classdesc class to manager text pixi based on $.Pixi.Sprite.Base
     */
    $.Pixi.Sprite.Text = class extends $.Pixi.Sprite.Base {
        /**
         * @constructor
         * @param {object} hash
         *  {stage} stage: stage that will get this children
         *  {string} text: initial text to display
         *  {object} style: style of text
         * @param {function} callback
         *  [calls after the load]
         */
        constructor(hash, callback) {
            this.hash = hash;
            this._text = "";
            super.constructor.call(this, this.hash.stage, callback);
        }
        /**
         * @function load
         * @description load the texture
         */
        load() {
            this.sprite = new PIXI.Text(this.hash.text || "");
            if ($.Utils.isObject(this.hash.style)) this.sprite.style = this.hash.style;
            // after load
            super.load.call(this);
        }
    }
    /**
     * :rect
     * @class 
     * @function Graphic
     * @memberof $.Pixi.Sprite
     * @classdesc class to manager Graphic pixi based on $.Pixi.Sprite.Base
     */
    $.Pixi.Sprite.Graphic = class extends $.Pixi.Sprite.Base {
        /**
         * @constructor
         * @param {object} hash
         *  {stage} stage: stage that will get this children
         *  {string} type: type of graphic. 'circle', 'rect'
         *  {color} bfill: beginFill
         *  {number} x: axis position graphic X
         *  {number} y: axis position graphic Y
         *  {number} width: size of width
         *  {number} height: size of height
         *  {number} alpha: alpha of graphic, default is 1
         *  {number} radius: radius to circle
         * @param {function} callback
         *  [calls after the load]
         */
        constructor(hash, callback) {
            this.hash = hash;
            this.hash.type = this.hash.type || "rect";
            super.constructor.call(this, this.hash.stage, callback);
        }
        /**
         * @function load
         * @description load the texture
         */
        load() {
            // rect
            if (this.hash.type === "rect") {
                this.sprite = new PIXI.Graphics();
                this.sprite.beginFill(this.hash.bfill || 0xDDDDDD, this.hash.alpha || 1);
                this.sprite.drawRect(
                    this.hash.x || 0, this.hash.y || 0,
                    this.hash.width || 96, this.hash.height || 24
                )
            } else if (this.hash.type === "circle") {
                this.sprite = new PIXI.Graphics();
                this.sprite.beginFill(this.hash.bfill || 0xDDDDDD, this.hash.alpha || 1);
                this.sprite.drawCircle(
                    this.hash.x || 0, this.hash.y || 0,
                    this.hash.radius || 6
                )
            }
            // after load
            super.load.call(this);
        }
    }
    // =============================================================================

})(Haya);
Imported["Haya"] = true;
