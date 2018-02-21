

// ================================================================================
// Plug-in    : Haya Core
// Author     : Dax Soft | Kvothe
// Website    : www.dax-soft.weebly.com
// Version    : 0.1.6
// Special thanks for Fehu (Alisson)
// ================================================================================

/*:
 * @author Dax Soft | Kvothe
 * 
 * @plugindesc Essential core for my script to MV.
 * 
 * @help
 * Important: Insert this plugin before every Haya plugin on the list.
 */

/* ================================================================================
Ctrl+F [locate]:
    :global
    :number
    :main
    :general
        :get
        :key
        :mouse
        :dialog
    :dmath
        :position
        :move
        :calc
    :net
        :download
    :pixi
        :pmanager
    :picture
    :text
    :movie
    :touch
    :scene_manager
    :scene_base
    :scene
    :tool | :end
================================================================================ */
Haya = new Object();
// pixi.baseTexture.hasLoaded
// =================================================================================
// [Global function] :global
// =================================================================================
function print(content) { console.log(content) };
function Picture() { this.initialize.apply(this, arguments) };
function Text() { this.initialize.apply(this, arguments) };
function Movie() { this.initialize.apply(this, arguments) };
function Button() { this.initialize.apply(this, arguments) };
function List() { this.initialize.apply(this, arguments) };
// =================================================================================
// [Number: extension] :number
// =================================================================================
if (typeof Number.prototype.isBetween === 'undefined') {
    // =============================================================================
    // [isBetween]
    //      -> min -> minimun value
    //      -> max -> maximun value
    //      -> equalNo -> the condition will just check the '<' or '>' if this be set as true
    // =============================================================================
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
// =================================================================================
// [Main] :main
// =================================================================================
(function($) {
    'use strict';
    // =============================================================================
    // [Global variable]: $ -> Haya
    // =============================================================================
    $.General = {Get: {}, Mouse: {}, Key: {}, Dialog: {file: {}}};
    $.DMath = {Position: {}, Calc: {}, Value: {repeat: {}, smooth: {}}};
    $.Pixi = {_requestedTextures: {}, data: {}, textureCache: {}};
    $.Net = {Download: {}};
    $.fs = require('fs');
    $.path = require('path');
    $.url = require('url');
    $.http = require('http');
    // =============================================================================
    // [General] :general
    // =============================================================================
    // =============================================================================
    // [Get-current] :get
    //      get the current filename script
    //      filename : if it is true, just the filename.
    // =============================================================================
    $.General.Get.current = function(justFilename) {
        let current = document.currentScript.src;
        if (justFilename === true) current = current.split('/').pop();
        return current;
    }
    // =============================================================================
    // [get-indexObject] 
    //      object : object value
    //      element : element that will return the index value
    //   get -1 if it is not return
    // =============================================================================
    $.General.Get.indexObject = function(object, element) {
        var _indexObject = -1;
        Object.keys(object).map(function(key, index, array) {
            if (array[index] === element) _indexObject = index; 
        })
        return _indexObject;
    }
    // =============================================================================
    // [folder] : get local folder name
    // =============================================================================
    $.General.Get.folder = function() {
        let path = window.location.pathname.replace(/[^\\\/]*$/, '');
        return path;
    }
    // =============================================================================
    // get a list of files from a dir
    // =============================================================================
    $.General.Get.fileList = function(path, filter, callback) {
        // check out if the folder exist
        if (!$.fs.existsSync(path)) {
            console.log("dir don't foud", path);
            return;
        }
        // get
        var files = $.fs.readdirSync(path);
        // each
        for (let i = 0; i < files.length; i++) {
            let filename = $.path.join(path, files[i]);
            let stat = $.fs.lstatSync(filename);
            if (stat.isDirectory()) {
                // recursive
                $.General.Get.fileList(filename, filter, callback);
            } else if (filter.test(filename)) { callback(filename) };
        };
    }
    // =============================================================================
    // [get-files]
    // =============================================================================
    $.General.Get.Files = function() {
        let index = 0;
        root = $.path.join(".", $.path.dirname(window.location.pathname));
        let files = $.fs.readdirSync(window.dirname);
        return files.filter(function(i) {
            let reg = /^[^\.]+$/
            return !reg.test(i);
        })
    }
    // =============================================================================
    // [anyKeyboard] :key
    // check out if press any key of keyboard 
    // =============================================================================
    $.General.Key.anyKeyboard = function() {
        var _anyKeyboard = false;
        Object.keys(Input.keyMapper).map(function(key, index) {
            if (Input.isPressed(Input.keyMapper[key])) _anyKeyboard = true;  
        })
        return _anyKeyboard;
    }
    // =============================================================================
    // [anyGamepad]
    // press any key of gamepad
    // =============================================================================
    $.General.Key.anyGamepad = function() {
        var _anyGamepad = false;
        Object.keys(Input.gamepadMapper).map(function(key, index) {
            if (Input.isPressed(Input.gamepadMapper[key])) _anyGamepad = true;  
        })
        return _anyGamepad;
    }
    // =============================================================================
    // [any] : any key pressed
    // =============================================================================
    $.General.Key.any = function() {
        return ($.General.Key.anyKeyboard() || $.General.Key.anyGamepad() || TouchInput.isTriggered());
    }
    // =============================================================================
    // keyCode
    // =============================================================================
    $.General.Key.char = function(keyCode) {
        return String.fromCharCode(keyCode);
    }
    // =============================================================================
    // [setup] :mouse
    //   -> this.mouse.{param} = (...)
    //   param:
    //      -> over | out -> create as function.
    //      -> trigger | repeat | press
    //          -> on | off -> create as function.
    //      -> x | y -> Number 
    //      -> active -> Boolean (to use the mouse function)
    //      -> drag
    //          -> active -> Boolean (to use the drag mouse function)
    //          -> start -> don't use this var.
    //          -> function -> create as function.
    // =============================================================================
    $.General.Mouse.setup = function() {
        return ({
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
    // =============================================================================
    // [dialog] :dialog
    // =============================================================================

    // =============================================================================
    // [dialog-file] : get a filename from a folder (choose)
    // =============================================================================
    $.General.Dialog.file.open = function(callback) {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.addEventListener("change", function(event) {
            callback(this.value);
        }, false);
        input.click();
    }
    // =============================================================================
    // [dialog-file-filter] : get a file with filter
    // =============================================================================
    $.General.Dialog.file.filter = function(filter, callBack) {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", filter || "");
        input.addEventListener("change", function(event) {
            callback(this.value);
        }, false);
        input.click();
    }
    // =============================================================================
    // [DMath] :dmath
    // =============================================================================
    // =============================================================================
    // [percentTo] 
    // =============================================================================
    $.DMath.percentTo = function(current, min, max) {
        return ((current * min) / max);
    }
    // =============================================================================
    // [toPercent] 
    // =============================================================================
    $.DMath.toPercent = function(current, min) {
        return ((current * min) / 100);
    }
    // =============================================================================
    // [rand] get a random numeric between a min and max value.
    // =============================================================================
    $.DMath.rand = function(min, max) {
        return Math.random() * (max - min) + min;
    }
    // =============================================================================
    // [randInt] : get a random numeric between a min and max value with integer
    // value.
    // =============================================================================
    $.DMath.randInt = function(min, max) {
        min = Math.ceil(min); max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // =============================================================================
    // [randomic] : variation of a value
    // =============================================================================
    $.DMath.randomic = function(current, variation) {
        let random = $.DMath.randInt(0, 1) === 0 ? $.DMath.rand(0, variation) : -$.DMath.rand(0, variation);
        current = (current + $.DMath.rand(0, 2)) + (current + random);
        return (Math.round(current) / 2);
    } 
    // =============================================================================
    // [repeat] : go among two value with a speed, repeating.
    // =============================================================================
    $.DMath.repeat = function(id, min, max, speed) {
        $.DMath.Value.repeat[id] = $.DMath.Value.repeat[id] || {}; 
        $.DMath.Value.repeat[id].value = $.DMath.Value.repeat[id].value || 0;
        if ($.DMath.Value.repeat[id].turn) {
            if ($.DMath.Value.repeat[id].value <= max) { $.DMath.Value.repeat[id].value += speed} else { $.DMath.Value.repeat[id].turn = false }
        } else {
            if ($.DMath.Value.repeat[id].value >= min) { $.DMath.Value.repeat[id].value -= speed} else { $.DMath.Value.repeat[id].turn = true }
        }
        return $.DMath.Value.repeat[id].value;
    }
    // =============================================================================
    // [smooth] : go to a target value with smoothie
    // =============================================================================
    $.DMath.smooth = function(hash) {
        $.DMath.Value.smooth[hash.id] = $.DMath.Value.smooth[hash.id] || {};
        $.DMath.Value.smooth[hash.id].value = $.DMath.Value.smooth[hash.id].value || 0;
        hash.boost = hash.boost || Math.PI;
        let _boost = 0;
        hash.compare = hash.compare || "forward";
        if (hash.compare === ">=" || hash.compare === "forward" || hash.compare === 0) {
            if ($.DMath.Value.smooth[hash.id].value <= hash.target) {
                _boost = Math.ceil(-$.DMath.percentTo(hash.boost, $.DMath.Value.smooth[hash.id].value, hash.target * 2));
                $.DMath.Value.smooth[hash.id].value += (hash.speed + _boost);
            } 
        }
        return $.DMath.Value.smooth[hash.id].value - 1;
    }
    // =============================================================================
    // [screen] :position
    //  hash -> Object
    //      type: type of position 
    //      object: this class have to be a width & height value
    //      width: width of object. If you don't setup by object.
    //      height: height of object. If you don't setup by object.
    // =============================================================================
    $.DMath.Position.screen = function(hash) {
        // default position 
        let point = new Point(0, 0);
        let width = hash.object === undefined ? hash.width : hash.object.width;
        let height = hash.object === undefined ? hash.height : hash.object.height;
        // condition
        if (hash.type === "center" || hash.type === "c" || hash.type === 0 ) {
            point.x = (Graphics.boxWidth - width) / 2;
            point.y = (Graphics.boxHeight - height) / 2;
        } else if (hash.type === "center-left" || hash.type === "cl" || hash.type === 1) {
            point.x = (Graphics.boxHeight - height) / 2;
        } else if (hash.type === "center-right" || hash.type === "cr" || hash.type === 2) {
            point.x = Graphics.boxWidth - width;
            point.y = (Graphics.boxHeight - height) / 2;
        } else if (hash.type === "center-top" || hash.type === "ct" || hash.type === 3) {
            point.x = (Graphics.boxWidth - width) / 2;
        } else if (hash.type === "center-bottom" || hash.type === "cb" || hash.type === 4) { 
            point.x = (Graphics.boxWidth - width) / 2;
            point.y = Graphics.boxHeight - height;
        } else if (hash.type === "upper-right" || hash.type === "ur" || hash.type === 5) { 
            point.x = Graphics.boxWidth - width;
        } else if (hash.type === "bottom-right" || hash.type === "br" || hash.type === 6) {
            point.x = Graphics.boxWidth - width;
            point.y =  Graphics.boxHeight - height;
        } else if (hash.type === "bottom-left" || hash.type === "bf" || hash.type === 7) {
            point.y =  Graphics.boxHeight - height;
        } 
        // return default if nothing is setup
        return point;
    }
    // =============================================================================
    // [object]
    //  hash -> object value
    //      -> type: -> default position type
    //      -> a: -> first object, that will change the position |has to be x, y, width, height|
    //      -> b: -> second object, that will be the reference point |has to be x, y, width, height|
    // =============================================================================
    $.DMath.Position.object = function(hash) {
        // default position 
        let point = new Point(hash.a.x, hash.a.y);
        // type
        if (hash.type === "center" || hash.type === "c" || hash.type === 0 ) {
            point.x = hash.b.x + (hash.b.width - hash.a.width) / 2;
            point.y = hash.b.y + (hash.b.height - hash.a.height) / 2;
        } else if (hash.type === "center-left" || hash.type === "cl" || hash.type === 1) {
            point.x = hash.b.x;
            point.y = hash.b.y + (hash.b.height - hash.a.height) / 2;
        } else if (hash.type === "center-right" || hash.type === "cr" || hash.type === 2) {
            point.x = hash.b.x + hash.a.width;
            point.y = hash.b.y + (hash.b.height - hash.a.height) / 2;
        } else if (hash.type === "center-top" || hash.type === "ct" || hash.type === 3) {
            point.x = hash.b.x + (hash.b.width - hash.a.width) / 2;
            point.y = hash.b.y;
        } else if (hash.type === "center-bottom" || hash.type === "cb" || hash.type === 4) { 
            point.x = hash.b.x + (hash.b.width - hash.a.width) / 2;
            point.y = hash.b.y + hash.b.height;
        } else if (hash.type === "upper-right" || hash.type === "ur" || hash.type === 5) { 
            point.x = hash.b.x + hash.b.width;
            point.y = hash.b.y - hash.b.height;
        } else if (hash.type === "upper-left" || hash.type === "ul" || hash.type === 6) { 
            point.x = hash.b.x;
            point.y = hash.b.y - hash.b.height;
        } else if (hash.type === "bottom-right" || hash.type === "br" || hash.type === 7) {
            point.x = hash.b.x + hash.b.width;
            point.y = hash.b.y + hash.b.height;
        } else if (hash.type === "bottom-left" || hash.type === "bf" || hash.type === 8) {
            point.x = hash.b.x;
            point.y = hash.b.y + hash.b.height;
        } 
        // return
        return point;
    }
    // =============================================================================
    // [Calc] :calc
    // =============================================================================
    $.DMath.Calc.Item = {};
    // =============================================================================
    // [calc-item-increase] > increase using reference something.;
    // =============================================================================
    $.DMath.Calc.Item.Use = function(hash) {
        // get
        let attr = hash.attr; // valor do atributo. O quanto aumenta, etc.
        let spirit = hash.spirit || 1.0; // se o personagem tá com espírito alto. Percentagem.
        let type = hash.type || 0.2; // raridade do item (0.1-1.0). Percentagem.
        let delta = hash.delta || 0.1; // taxa de evasão do item. Percentagem.
        let skill = hash.body || 0.1; // o quão o corpo do personagem irá se nutrir do item. Percentagem.
        let value;
        // calc
        attr = $.DMath.randomic(attr, (attr*type));
        value = (attr * skill);
        value = $.DMath.randomic(value, (delta*value) * spirit);
        // return
        return value;
    }


    // =============================================================================
    // [Net] :net
    // =============================================================================

    // =============================================================================
    // [Download-Url] :download
    // download a file from url and show option to save
    // =============================================================================
    $.Net.Download.Url = function(filename, url) {
        // element
        let link = document.createElement("a");
        link.download = filename;
        link.target = "_blank";
        // url
        link.url = url;
        document.body.appendChild(link);
        link.click();
        // clean up
        document.body.removeChild(link);
    };
    // =============================================================================
    // [pixi] :pixi
    // =============================================================================
    // =============================================================================
    // [pixi-manager] :pmanager
    // =============================================================================
    $.Pixi.Manager = class {
        // [constructor]
        constructor() {
            super();
            this.data = this.data || {};
            this._isReady = false;
            this.loadedTextures = {};
            this._container = {};
        }
        // get container
        container(id, uchild) {
            if (id === undefined) id = "default";
            if (this._container[id]) {
                if (uchild === undefined) SceneManager._scene.addChild(this._container[id]);
                return this._container[id];
            } else {
                this._container[id] = new PIXI.Container();
                if (uchild === undefined) SceneManager._scene.addChild(this._container[id]);
                return this._container[id];
            }
        }
        
        // dispose
        dispose() {
            if ((this.data === undefined) || (typeof this.data !== 'object')) return;
            Object.keys(this.data).map(function(key, index) {
                if (this.data[key].dispose)
                    this.data[key].dispose();
            }.bind(this))
            this.data = {};
            $.Pixi._requestedTextures = {};
        }
        // update
        update() {
            if ((this.data === undefined) && (typeof this.data !== 'object')) return;
            Object.keys(this.data).map(function(key, index) {
                if (this.data[key].update)
                    this.data[key].update();
            }.bind(this))
        }
        // add
        add(pixi, index) {
            if (pixi !== undefined) {
                this.data[index] = pixi;
            }
        }
        // off
        off(index) {
            if (this.data[index] !== undefined) {
                this.data[index].dispose();
                delete this.data[index];
            }
        }
        // get texture
        texture(path) {
            return this.loadedTextures[path];
        }
        // example
        /*
        // preUpdate
                this._preUpdate = function() {
                    if (Haya.Core.pixi.data['back']._loaded) {
                        Haya.Core.pixi.swapChildren('version', 'back', 1);
                        this._preUpdate = null;
                    }
                }
        */
        // swapChildren
        swapChildren(childA, childB, condition) {
            let a = this.data[childA].sprite;
            let b = this.data[childB].sprite;
            let _condition = condition === undefined ? 1 : condition
            if (_condition === 0) {
                SceneManager._scene.swapChildren(a, b);
            } else if (_condition === 1) {
                let cA = SceneManager._scene.getChildIndex(a);
                let cB = SceneManager._scene.getChildIndex(b);
                if (cA > cB) { return false; } else { SceneManager._scene.swapChildren(a, b) }
            }
        }
        // loadRequestedTextures
        loadRequestedTextures() {
            // if don't need more
            if ($.Pixi._requestedTextures.length <= 0) {
                this._isReady = true;
            }
            // each object
            let loader = new PIXI.loaders.Loader();
            for (let name in $.Pixi._requestedTextures) {
                let path = $.Pixi._requestedTextures[name];
                // cache
                if ($.Pixi.textureCache[path]) {
                    this.loadedTextures[path] = $.Pixi.textureCache[path].clone();
                } else {
                    loader.add(path);
                }
            }
            // self
            let self = this;
            loader.load(function(ld, resource) {
                for (let name in resource) {
                    self.loadedTextures[name] = resource[name].texture;
                }
                self._isReady = true;
            })
        }
    }
    // ============================================================================= 
    // data
    // ============================================================================= 
    $.Pixi.data = new $.Pixi.Manager();
    // ============================================================================= 
    // prepareTexture
    // ============================================================================= 
    $.Pixi.prepareTexture = function(path) {
        if (typeof path === 'array') {
            for (let name in path) {
                $.Pixi._requestedTextures[name] = name;
            }
        } else if (typeof path === 'string') {
            $.Pixi._requestedTextures[path] = path;
        }
    }
    // ============================================================================= 
    // [Picture] :picture
    // Example:
    /*
        Haya.Pixi.data.add(new Picture(filename, function() {
            /.../
        }), 'index')
    */
    // ============================================================================= 
    Picture.prototype = Object.create(Picture.prototype);
    Picture.prototype.constructor = Picture;
    // ============================================================================= 
    // [initialize]
    //      texture : texture
    //      callback
    // ============================================================================= 
    Picture.prototype.initialize = function(filename, callback, idcont) {
        // arguments info
        this._filename = filename;
        this._x = Graphics.pageToCanvasX(1);
        this._y = Graphics.pageToCanvasX(1);
        this._loaded = false;
        this._callBack = callback;
        this._afterUpdate = null;
        this._preUpdate = null;
        // mouse function
        this.mouse = $.General.Mouse.setup();
        // sprite
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.sprite.visible = false;
        // addchild
        $.Pixi.data.container(idcont).addChild(this.sprite);
        // load-on
        let loader = new PIXI.loaders.Loader();
        loader.add({
            name: 'picture',
            url: this._filename,
        }, function() {
            // complete load
            this.sprite.texture = PIXI.Texture.fromImage(this._filename);
            // setup after loaded
            this.setup();
        }.bind(this));
        loader.load();
    }
    // ============================================================================= 
    // setup
    // ============================================================================= 
    Picture.prototype.setup = function() {
        this._loaded = true;
        this.sprite.x = this._x;
        this.sprite.y = this._y;
        this.sprite.interactive = true;
        this.sprite.renderable = true;
        this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        this.sprite.visible = true;
        // callback
        if (typeof this._callBack === 'function')  this._callBack.apply(this, arguments);
    }
    // ============================================================================= 
    // [dispose]
    // ============================================================================= 
    Picture.prototype.dispose = function() {
        if (this._loaded)
            this.sprite.destroy(true); 
    }
    // ============================================================================= 
    // [update]
    // ============================================================================= 
    Picture.prototype.update = function() {
        if (this._loaded) {
            // preUpdate
            if (typeof this._preUpdate === 'function')  this._preUpdate.apply(this, arguments);
            // render
            this.sprite.updateTransform();
            Graphics.render(this.sprite);
            //this.sprite.hitArea.x = this.sprite.x - ( (this.sprite.x * this.sprite.scale.x) / 2 );
            //this.sprite.hitArea.y = this.sprite.y - ( (this.sprite.y * this.sprite.scale.y) / 2 );
            //this.sprite.hitArea.width = this.sprite.width + ( (this.sprite.width * this.sprite.scale.x) / 2);
            //this.sprite.hitArea.height = this.sprite.height + ( (this.sprite.height * this.sprite.scale.y) / 2);
            this.sprite.hitArea.x = this.sprite.x;
            this.sprite.hitArea.y = this.sprite.y;
            // check out if the mouse will be used on
            if (this.mouse.active) {
                // get the mouse position
                this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
                this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
                this.mouseSetup();
            }
            // afterUpdate
            if (typeof this._afterUpdate === 'function')  this._afterUpdate.apply(this, arguments);
        }
    }
    // =============================================================================
    // [position] : library of position to class
    // =============================================================================
    Picture.prototype.position = function(type) {
        var _position = $.DMath.Position.screen({type: type, object: this.sprite});
        this.sprite.x = _position.x;
        this.sprite.y = _position.y;
    }
    // =============================================================================
    // [mirror X] : mirror sprite in X achor
    // =============================================================================
    Picture.prototype.mirrorX = function(point) {
        point = point || 1;
        this.sprite.anchor.x = point; /* 0 = top, 0.5 = center, 1 = bottom */
        this.sprite.scale.x *= -1;
    }
    // =============================================================================
    // [mirror Y] : mirror sprite in Y achor
    // =============================================================================
    Picture.prototype.mirrorY = function(point) {
        point = point || 1;
        this.sprite.anchor.y = point; /* 0 = top, 0.5 = center, 1 = bottom */
        this.sprite.scale.y *= -1;
    }
    // =============================================================================
    // [_mouseOver] : check out if the mouse is over
    // =============================================================================
    Picture.prototype._mouseOver = function() {
        if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
        if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
            if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                return true;
            }
        }
        return false; 
    }
    // =============================================================================
    // [mouseSetup] : run all functions and settings about the Mouse.
    // =============================================================================
    Picture.prototype.mouseSetup = function() {
        // check out if the mouse is over or not
        if (this._mouseOver()) {
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
    // =============================================================================
    // [Text] :text
    //      -> to display a text.
    // Example:
    /*
    Haya.Pixi.data.add(new Text("text", function() {
        /.../
    }), 'example')
    */
    // =============================================================================
    // =============================================================================
    // create constructor | prototype
    // =============================================================================
    Text.prototype = Object.create(Text.prototype);
    Text.prototype.constructor = Text;
    // =============================================================================
    // [initialize]
    //      -> text -> [String]
    //      -> x | y -> [Number] 
    //      -> callBack -> [function]
    // =============================================================================
    Text.prototype.initialize = function(text, callBack, idcont) {
        // arguments info
        this._text = text;
        this._x = Graphics.pageToCanvasX(1);
        this._y = Graphics.pageToCanvasX(1);
        this._loaded = false;
        this._callBack = callBack;
        this._afterUpdate = null;
        this._preUpdate = null;
        // mouse function
        this.mouse = $.General.Mouse.setup();
        // load
        this.sprite = new PIXI.Text(this._text);
        // addchild
        $.Pixi.data.container(idcont).addChild(this.sprite);
        // setup
        this.sprite.x = this._x;
        this.sprite.y = this._y;
        this.sprite.interactive = true;
        this.sprite.renderable = true;
        this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        // callback
        if (typeof this._callBack === 'function')  this._callBack.apply(this, arguments);
    }
    // =============================================================================
    // set style
    // =============================================================================
    Text.prototype.style = function(_style) { this.sprite.style = _style; }
    // =============================================================================
    // new text
    // =============================================================================
    Text.prototype.text = function(text) { this.sprite.text = text; }
    // =============================================================================
    // [dispose] : destroy the object
    // =============================================================================
    Text.prototype.dispose = function() {
        if (this.sprite.destroy)
            this.sprite.destroy(true);
    }
    // =============================================================================
    // [update] : update function
    // =============================================================================
    Text.prototype.update = function() {
        // preUpdate
        if (typeof this._preUpdate === 'function')  this._preUpdate.apply(this, arguments);
        // render
        this.sprite.updateTransform();
        Graphics.render(this.sprite);
        // hitArea
        this.sprite.hitArea.x = this.sprite.x;
        this.sprite.hitArea.y = this.sprite.y;
        this.sprite.hitArea.width = this.sprite.width;
        this.sprite.hitArea.height = this.sprite.height;
        // check out if the mouse will be used on
        if (this.mouse.active) {
            // get the mouse position
            this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
            this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
            this.mouseSetup();
        }
        // afterUpdate
        if (typeof this._afterUpdate === 'function')  this._afterUpdate.apply(this, arguments);
    }
    // =============================================================================
    // [position] : library of position to class
    // =============================================================================
    Text.prototype.position = function(type) {
        var _position = $.DMath.Position.screen({type: type, object: this.sprite});
        this.sprite.x = _position.x;
        this.sprite.y = _position.y;
    }
    // =============================================================================
    // [_mouseOver] : check out if the mouse is over
    // =============================================================================
    Text.prototype._mouseOver = function() {
        if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
        if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
            if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                return true;
            }
        }
        return false; 
    }
    // =============================================================================
    // [mouseSetup] : run all functions and settings about the Mouse.
    // =============================================================================
    Text.prototype.mouseSetup = function() {
        // check out if the mouse is over or not
        if (this._mouseOver()) {
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
    // =============================================================================
    // [Movie] :movie
    // =============================================================================
    Movie.prototype = Object.create(Movie.prototype);
    Movie.prototype.constructor = Movie;
    // =============================================================================
    // initialize
    // =============================================================================
    Movie.prototype.initialize = function(filename, callBack, idcont) {
        // setup
        this._filename = filename; // Game_Interpreter.prototype.videoFileExt()
        this._loaded = false;
        this._callBack = callBack;
        this._afterUpdate = null;
        this._preUpdate = null;
        // sprite
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        // addchild
        if (idcont === undefined) idcont = "movie";
        SceneManager._scene.addChild(this.sprite);
        // loader
        let loader = new PIXI.loaders.Loader();
        loader.add({
            name: 'movie',
            url: this._filename,
        }, function() {
            // complete load
            this._texture = PIXI.Texture.fromVideo(this._filename);
            this._loaded = true;
            this.sprite.texture = this._texture;
            // updated the texture
            this.sprite.update = function update () { 
                this._texture.update(); 
            }
            // eternal loop
            this.sprite.texture.baseTexture.source.loop = true;
            // callback
            if (typeof this._callBack === 'function')  this._callBack.apply(this, arguments);
        }.bind(this));
        loader.load();
    }
    // =============================================================================
    // [auto]
    // =============================================================================
    Movie.prototype.auto = function() {
        this.sprite.width = Graphics.boxWidth;
        this.sprite.height = Graphics.boxHeight;
    }
    // =============================================================================
    // dispose
    // =============================================================================
    Movie.prototype.dispose = function() {
        this.sprite.texture.baseTexture.source.pause();
        this.sprite.update = null;
        this.sprite.destroy(true);
        this._texture.destroy();
    }
    // =============================================================================
    // update
    // =============================================================================
    Movie.prototype.update = function () {
        // preUpdate
        if (typeof this._preUpdate === 'function')  this._preUpdate.apply(this, arguments);
        if (this._loaded) {
            //Graphics.render(this.sprite);
            // afterUpdate
            if (typeof this._afterUpdate === 'function')  this._afterUpdate.apply(this, arguments);
        }
    }
    // ============================================================================= 
    // [TouchInput] :touch
    // =============================================================================
    // =============================================================================
    // [_onMouseMove]
    // remove the limit to check out the position
    // =============================================================================
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
    // ============================================================================= 
    // [SceneManager] :scene_manager
    // ============================================================================= 
    // ============================================================================= 
    // [isScene] : check out if the current scene is (?)
    //      name : name of scene
    // ============================================================================= 
    SceneManager.prototype.isScene = function(name) {
        return SceneManager._scene && SceneManager._scene.constructor === name;
    }
    // ============================================================================= 
    // [Scene_Base] :scene_base
    // ============================================================================= 
    // ============================================================================= 
    // [start]
    // ============================================================================= 
    var _aliasSta_SB = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        $.Pixi.data.loadRequestedTextures();
        _aliasSta_SB.call(this);
    }
    // ============================================================================= 
    // [update]
    // ============================================================================= 
    var _aliasUpdt_SB = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _aliasUpdt_SB.call(this);
        $.Pixi.data.update();
    }
    // ============================================================================= 
    // [terminate]
    // ============================================================================= 
    var _aliasTerm_SB = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        $.Pixi.data.dispose();
        _aliasTerm_SB.call(this);
    }
    // ============================================================================= 
    // [EasyTool] :tool :end
    // ============================================================================= 
    // add on picture
    $.img = function(hash, callback) {
        $.Pixi.data.add(new Picture(hash.filename, callback, hash.id), hash.index);
    }
    // add on text
    $.text = function(hash, callback) {
        $.Pixi.data.add(new Text(hash.text, callback, hash.id), hash.index);
    }
    // add on movie
    $.movie = function(hash, callback) {
        $.Pixi.data.add(new Movie(hash.filename, callback, hash.id), hash.index)
    }
    // add on button
    $.button = function(hash, callback) {
        $.Pixi.data.add(new Button(hash, callback, hash.id), hash.index);
    }
    // get data from haya.pixi.data
    $.pdata = function(index) { return $.Pixi.data.data[index]; }
    // get if data is loaded
    $.Pixi.loaded = function(index) { return $.Pixi.data.data[index]._loaded; }
    // loadJson
    $.json = function(filename, callback, name) {
         let loader = new PIXI.loaders.Loader();
         loader 
             .add(name, filename)
             .load(function(ld, rs) {
                 callback (!rs[name] ? false : rs[name].data);
             });
     }
    // loader Pixi function
    $.load = function(filename, callback, name) {
        name = name || 'load'
        let loader = new PIXI.loaders.Loader();
        loader 
            .add(name, filename)
            .load(function(rload, resource) {
                callback(resource[name]);
            });
    }
})(Haya);
