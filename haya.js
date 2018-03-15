/**
 * @file Haya - Core
 * @author Dax Soft | Kvothe <www.dax-soft.weebly> / <dax-soft@live.com>
 * @version 0.2.3
 * @license https://dax-soft.weebly.com/legal.html
 * Special thanks for Fehu (Alisson)
 */


/*:
 * @author Dax Soft | Kvothe
 * 
 * @plugindesc Essential core for my script to MV. [0.2.3]
 * 
 * @help
 * Important: Insert this plugin before every Haya plugin on the list.
 */

/* ================================================================================
Ctrl+F [locate]:
    :global
    :number
    :string
    :fileio
    :utils
    :dmath
    :touch
    :sceneManager
    :piximanager
    :sprite
    :tool
================================================================================ */
var Imported = Imported || new Object();
var Haya = new Object();
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
    $.alias = new Object();
    $.Pixi = new Object();
    $.Pixi.TextureCache = new Object();
    // =============================================================================
    /**
     * :fileio
     * @function FileIO
     * @memberof Haya
     * @desc manager for files
     */
    $.FileIO = function() { throw new Error('This is a static class'); }
    /**
     * @function Download
     * @memberof FileIO
     * @description tool to download files from web
     * @example 
     *  // First, set up the links and destination:
     *  Haya.FileIO.Download.set([{url: "", dest: "", onLoad: function}...]);
     *  // Second, call on a update method:
     *  Haya.FileIO.Download.run();
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
    $.FileIO.xml = function(filepath) {
        let filetext = String($.FileIO.txt(filepath));
        var parser = new DOMParser();
        var result = parser.parseFromString(filetext,  "application/xml");
        return result;
    }
    /**
     * @desc read JSON file and return to object
     * @param {string} filepath local filepath to file | url
     * @return {object}
     */
    $.FileIO.json = function(filepath) { return (JSON.parse($.FileIO.ajax(filepath))); }
    /**
     * @desc export object to JSON file
     * @param {object} object that will be exported
     * @param {string} filepath local filepath to file | url
     */
    $.FileIO.toJson = function(object, filepath) {
        var fs = require('fs');
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
        let path = require('path');
        var localDirBase = path.dirname(process.mainModule.filename);
        return path.join(localDirBase, pathname);
    }
    /**
     * @desc get the list of files from folder
     * @param {string} filepath local filepath to file | url
     * @param {function} callback function that has as argument, the filepath
     */
    $.FileIO.list = function(filepath, callback) {
        // get local folder
        filepath = $.FileIO.local(filepath);
        // variables
        let fs = require('fs'),
            path = require('path');
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
     * @description list of download
     */
    $.FileIO.Download.list = [];
    $.FileIO.Download.load = [];
    /**
     * @description set download list
     * @param {array} array Set using Object
     * @example 
     * // array param
     * [{url: "link", dest: "", name: "", onLoad: function, onProgress: function(value)}]
     * // description
     * url: "http link";
     * dest: "local to save"; // on project folder | not defined will be main folder project
     * name: "filename"; // if is empty or not defined, will be the default filename
     * onLoad: function(); // will call the function after download
     * onProgress: function(value, total, chucnk); // return to value of chunk progress (length)
     */
    $.FileIO.Download.set = function(array) {
        $.FileIO.Download.list = array;
        var i = array.length;
        while (i--) {
            $.FileIO.Download.load[i] = false;
        }
    }
    /**
     * @description download the file
     * @param {string} url
     * @param {string} dest
     * @param {string} filename
     * @param {function} onLoad | (dest, filename)
     * @param {function} onProgress | (current (chunk.length), total (content-length), chunk)
     * @param {number} index
     */
    $.FileIO.Download.download = function(url, dest, filename, onLoad, onProgress, index) {
        // return
        if ($.Utils.invalid(url)) return;
        if ($.Utils.invalid($.FileIO.Download.list[index])) return;
        // Node
        var fs = require('fs');
        var http = null;
        // http
        if (url.match(/(https)/i)) {
            http = require('https');
        } else {
            http = require('http');
        }
        // return
        if ($.Utils.invalid(http)) return;
        // filename
        filename = filename || url.split('/').pop();
        // dest
        dest = $.FileIO.local(dest || "");
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        var destination = dest + "/" + filename;
        // file
        var file = fs.createWriteStream(destination);
        // request
        var request = http.get(url, function (res) {
            console.log(res);
            res.on('data', function (chunk) {
                if ($.Utils.isFunction(onProgress)) {
                    onProgress.call(
                        this, 
                        chunk.length, 
                        parseInt(res.headers['content-length']), 
                    chunk);
                }
            })
            res.pipe(file);
            file.on('finish', function () {
                file.close(function () {
                    $.FileIO.Download.load[index] = true;
                    onLoad.call(this);
                });
            })
        }).on('error', function (err) {
            fs.unlink(dest);
            console.warn(err.message);
        })
    }
    /**
     * @description run download of file list
     */
    $.FileIO.Download.run = function() {
        // if is empty or invalid
        if ($.Utils.invalid($.FileIO.Download.list)) return false;
        if ($.Utils.isArray( $.FileIO.Download.list) &&  $.FileIO.Download.list.length < 0) return false;
        $.FileIO.Download.load.forEach(function (rvalue, index) {
            if (rvalue === false) {
                let value = $.FileIO.Download.list[index];
                $.FileIO.Download.download(value.url, value.dest, value.name, value.onLoad, value.onProgress, index);
            }
        })
    }

    //$.FileIO.Download.download(value.url, value.dest, value.name, value.onLoad, value.onProgress, index);
    // =============================================================================
    /**
     * :util
     * @function Utils
     * @memberof Haya
     * @desc useful tools
     */
    $.Utils = function() { throw new Error('This is a static class'); }
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
     * @desc check out if has value on variable
     * @param {any} 
     * @return {boolean}
     */
    $.Utils.hasValue = function(variable) { return (variable !== undefined || variable !== null); } 
    /**
     * @desc check out if is invalid
     * @param {any}
     * @return {boolean}
     */
    $.Utils.invalid = function(object) { return (typeof object === 'undefined' || typeof object === 'null') }
    /**
     * @desc get index by propriety of object
     * @param {object} object that will be checked
     * @param {string} propriety that will be checked
     * @param {string} value -> that will be found and return to his index;
     */
    $.Utils.objectIndex = function(object, propriety, value) {
        object.map(function (element) { return element[propriety];}).indexOf(value);
    }
    /**
     * @desc return the next element from 'object'
     * @param {object} 
     * @param {string} current keyname
     * @return {object}
     */
    $.Utils.nextObject = function(object, current) {
        var next  = (Object.keys(object).indexOf(current) + 1) % Object.keys(object).length;
        console.log(object[Object.keys(object)[next]], next)
        return object[Object.keys(object)[next]];
    }
    /**
     * @desc return the previous element from 'object'
     * @param {object} 
     * @param {string} current keyname
     * @return {object}
     */
    $.Utils.predObject = function(object, current) {
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
    $.Utils.merge = function(object, mobject, replace) {
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
    // =============================================================================
    /**
     * :dmath
     * @function DMath
     * @memberof Haya
     * @desc tools for calcs
     */
    $.DMath = function() { throw new Error('This is a static class'); }
    /**
     * @function Position
     * @memberof DMath
     * @desc tools for positions calcs
     */
    $.DMath.Position = function() { throw new Error('This is a static class'); }
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
        if (!$.Utils.isObject(request)) return false;
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
     * @function SpriteObject
     * @class SpriteObject
     * @memberof PIXI.Container
     * @description make more easier display picture or text toward scene
     */
    $.SpriteObject = class extends PIXI.Container {
        /**
         * @param {object} hash that contains
         *      [string] type: [text or picture, default is picture],
         *      [PIXI.Texture] texture: [just if the type is "picture"],
         *      [string] text: [first text value, if the type is "texture"],
         *      [class] stage: [place where this sprite will be add on child, for default is SceneManger._scene]
         * @param {function} callback to setup
         */
        constructor(hash, callback) {
            super.constructor();
            this.hash = hash;
            this.callback = callback;
            this.setup();
            this.load();
            if ($.Utils.isFunction(this.callback)) this.callback.apply(this, arguments);
        }
        // -------------------------------------------------------------------------
        // setup
        // ------------------------------------------------------------------------- 
        setup() {
            // default setup
            this._x = this.hash.x || 0;
            this._y = this.hash.y || 0;
            this._loaded = false;
            this._update = null;
            // mouse setup
            this.mouse = ({
                x: 0,
                y: 0,
                active: false,
                over: null,
                out: null, 
                trigger: {on: null, off: null},
                press: {on: null, off: null},
                repeat: {on: null, off: null},
                drag: {active: false, start: false, function: null}
            });
        }
        // -------------------------------------------------------------------------
        // load texture
        // -------------------------------------------------------------------------
        load() {
            // type | default is 'picture'
            this.hash.type = this.hash.type || "picture";
            // condition
            if (this.hash.type === "picture") {
                // default sprite
                this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
                // there is texture?
                if (this.hash.texture) {
                    this.sprite.texture = this.hash.texture;
                }
            } else if (this.hash.type === "text") {
                // default sprite
                this.sprite = new PIXI.Text("");
                this.sprite.text = this.hash.text || "";
            }
            // stage | default is 'scene'
            this.hash.stage = this.hash.stage || SceneManager._scene;
            this.hash.stage.addChild(this.sprite);
            // setup sprite
            this.sprite.x = this._x;
            this.sprite.y = this._y;
            this.sprite.renderable = true;
            this.sprite.visible = true;
            this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
            // loaded
            this._loaded = true;
        }
        /**
         * @desc dispose element
         * @param {boolean} destroy texture
         */
        dispose(destroy) { 
            if (this._loaded) {
                this.sprite.destroy(destroy);  
            } 
        }
        // -------------------------------------------------------------------------
        // update
        // -------------------------------------------------------------------------
        update() {
            // return if is not loaded
            if (this._loaded === false) return;
            // render
            this.sprite.updateTransform();
            Graphics.render(this.sprite);
            // update hit area
            this.sprite.hitArea.x = this.sprite.x;
            this.sprite.hitArea.y = this.sprite.y;
            // check out if the mouse will be used on
            if (this.mouse.active) {
                // get the mouse position
                this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
                this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
                this.updateMouse();
            }
            // _update
            if ($.Utils.isFunction(this._update)) this._update.apply(this, arguments);
        }
        /**
         * @desc display this sprite based on screen
         * @param {string} type see on $.DMath.Position.screen
         */
        position(type) {
            let _position = $.DMath.Position.screen({type: type, object: this.sprite});
            this.sprite.x = _position.x;
            this.sprite.y = _position.y;
        }
        /**
         * @desc invert sprite
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
        // -------------------------------------------------------------------------
        // check out if mouse is over
        // -------------------------------------------------------------------------
        mouseOver() {
            if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
            if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
                if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                    return true;
                }
            }
            return false; 
        }
        // -------------------------------------------------------------------------
        // update the mouse
        // -------------------------------------------------------------------------
        updateMouse() {
            // check out if the mouse is over or not
            if (this.mouseOver()) {
                // function that will be call
                if (typeof this.mouse.over === 'function') this.mouse.over.apply(this);
                // check out if was triggered inside
                if (TouchInput.isTriggered()) 
                    if (typeof this.mouse.trigger.on === 'function') this.mouse.trigger.on.apply(this);
                // check out if was pressed inside
                if (TouchInput.isLongPressed()) {
                    if (!this.mouse.drag.active) {
                        if (typeof this.mouse.press.on === 'function') this.mouse.press.on.apply(this);
                    } else {
                        if (typeof this.mouse.drag.function === 'function') this.mouse.drag.function.apply(this);
                        this.sprite.x = this.mouse.x - ( ( (this.sprite.hitArea.width) ) / 2 )
                        this.sprite.y = this.mouse.y - ( ( (this.sprite.hitArea.height) ) / 2 )
                    }
                } else {
                if (this.mouse.drag.active)  this.mouse.drag.start = false;
                }
                // check out if was repeated inside
                if (TouchInput.isRepeated())
                    if (typeof this.mouse.repeat.on === 'function') this.mouse.repeat.on.apply(this);
            } else {
                // function that will be call
                if (typeof this.mouse.out === 'function') this.mouse.out.apply(this);
                // check out if was triggered inside
                if (TouchInput.isTriggered()) 
                    if (typeof this.mouse.trigger.off === 'function') this.mouse.trigger.off.apply(this);
                // check out if was pressed inside
                if (TouchInput.isLongPressed())
                    if (typeof this.mouse.press.off === 'function') this.mouse.press.off.apply(this);
                // check out if was repeated inside
                if (TouchInput.isRepeated())
                    if (typeof this.mouse.repeat.off === 'function') this.mouse.repeat.off.apply(this);
            }
        }
    }
    // =============================================================================
    /**
     * :tool
     * @description shortcuts toward some functions
     * @var Haya
     */
    
    /**
     * @desc create sprite based on picture
     * @param {class} texture PIXI.Texture: texture that you can get using $.Pixi.Manager.cache
     * @param {object} hash setup elements 'see $.SpriteObject'
     * @param {function} callback setup callback function
     * @return {class} return $.SpriteObject class.
     */
    $.Picture = function(texture, hash, callback) {
        hash = hash || {};
        hash.type = "picture";
        hash.texture = texture;
        return (new $.SpriteObject(hash, callback));
    }
    /**
     * @desc create text spriteObject
     * @param {string} text that will be the first value to display
     * @param {object} hash setup elements 'see $.SpriteObject'
     * @param {function} callback setup callback function
     * @return {class} return $.SpriteObject class.
     */
    $.Text = function(text, hash, callback) {
        hash = hash || {};
        hash.type = "text";
        hash.text = text;
        return (new $.SpriteObject(hash, callback));
    }
})(Haya);
Imported["Haya"] = true;
