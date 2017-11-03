// ================================================================================
// Plug-in    : Haya Core
// Author     : Dax Soft | Kvothe
// Website    : www.dax-soft.weebly.com
// Version    : 0.1.0
// ================================================================================

/*:
 * @author: Dax Soft | Kvothe
 * 
 * @plugindesc Essential core for my script to MV.
 * 
 * @param << General >>
 * @default
 *
 * @param Default_Drag
 * @parent << General >> 
 * @type boolean
 * @desc default with drag on every picture, text [pixi manager]
 * @default false
 * 
 * @help
 * ================================================================================
 * This plugin is a requirement for almost all of my other RPG Maker MV plugins. 
 * You should ensure this plugin is also loaded before all other my plugins. 
 * Check out always in my website, the current version of this script.
 * ================================================================================
 * 0.1.0 :
 *  - some functions from ruby to javascript
 *  - some functions from PIXI for easy manager as display picture, text.
 * ================================================================================
 * 
*/

var Imported = Imported || {};
var Haya = Haya || {};
Haya.Core = Haya.Core || {};
Haya.Core.Version = 0.1;

/* ================================================================================
Ctrl+F [locate]:
    :picture
    :text
    :pixi [pixi manager]
    :scene
================================================================================ */

// $main$
(function($){
'use strict';
    // =================================================================================
    // [Parameters]:
    // =================================================================================
    $.parameters = {};
    // =================================================================================
    // [setup of mouse for: Picture | Text]
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
    // =================================================================================
    $._setupMouse = function() {
        return ({
            x: 0,
            y: 0,
            active: true,
            over: null,
            out: null, 
            trigger: {on: null, off: null},
            press: {on: null, off: null},
            repeat: {on: null, off: null},
            drag: {active: true, start: false, function: null}
        });
    }
    // =================================================================================
    // [Number: extension] :number
    // =================================================================================
    if (typeof Number.prototype.isBetween === 'undefined') {
        // =================================================================================
        // [isBetween]
        //      -> min -> minimun value
        //      -> max -> maximun value
        //      -> equalNo -> the condition will just check the '<' or '>' if this be set as true
        // =================================================================================
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
    }
    // =================================================================================
    // [TouchInput] :touch
    // =================================================================================
    // [remove the limit to check out the position]
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
    // =================================================================================
    // [SceneManager] :scene
    // =================================================================================
    // [isScene] : 
    //      -> name : Name of Scene.
    SceneManager.prototype.isScene = function(name) {
        var scene = SceneManager._scene;
        return scene && scene.constructor === name;
    }
    // =================================================================================
    // [Text] :text
    //      -> to display a text.
    // Example:
    //     $.pixi.add(new Text(textSting, posX, posY, function() {
    //          [this] -> this of Text function
    //          this.sprite.style = {fill: ['#ffffff', '#00ff99']}
    //          this.mouse.over = function(_mouseover) { this.sprite.alpha = 0.5; }
    //          this.mouse.out = function(_mouseout) { this.sprite.alpha = 1; }
    //     }))
    // =================================================================================
    function Text() {
        this.initialize.apply(this, arguments);
    }
    // =================================================================================
    // create constructor | prototype
    // =================================================================================
    Text.prototype = Object.create(Text.prototype);
    Text.prototype.constructor = Text;
    // =================================================================================
    // [initialize]
    //      -> text -> [String]
    //      -> x | y -> [Number] 
    //      -> callBack -> [function]
    // =================================================================================
    Text.prototype.initialize = function(text, x, y, callBack) {
        // arguments info
        this._text = text;
        this._x = Graphics.pageToCanvasX(x);
        this._y = Graphics.pageToCanvasX(y);
        this._loaded = false;
        this._callBack = callBack;
        // mouse function
        this.mouse = $._setupMouse();
        // load
        this.sprite = new PIXI.Text(this._text);
        SceneManager._scene.addChild(this.sprite);
        this.sprite.x = this._x;
        this.sprite.y = this._y;
        this.sprite.interactive = true;
        this.sprite.interactiveChildren = true;
        this.sprite.renderable = true;
        this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        // callback
        if (typeof this._callBack === 'function')  this._callBack.apply(this);
    }
    // set style
    Text.prototype.style = function(_style) { this.sprite.style = _style; }
    // new text
    Text.prototype.text = function(text) { this.sprite.text = text; }
    // =================================================================================
    // [dispose] : destroy the object
    // =================================================================================
    Text.prototype.dispose = function() {
        if (this.sprite.destroy)
            this.sprite.destroy();
    }
    // =================================================================================
    // [update] : update function
    // =================================================================================
    Text.prototype.update = function() {
        this.sprite.updateTransform();
        Graphics.render(this.sprite);
        // hitArea
        this.sprite.hitArea.x = this.sprite.x;
        this.sprite.hitArea.y = this.sprite.y;
        this.sprite.hitArea.width = this.sprite.width;
        this.sprite.hitArea.height = this.sprite.height;
        // get the mouse position
        this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
        this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
        // check out if the mouse will be used on
        if (this.mouse.active) {
            this.mouseSetup();
        }
    }
    // =================================================================================
    // [_mouseOver] : check out if the mouse is over
    // =================================================================================
    Text.prototype._mouseOver = function() {
        if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
        if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
            if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                return true;
            }
        }
        return false; 
    }
    // =================================================================================
    // [mouseSetup] : run all functions and settings about the Mouse.
    // =================================================================================
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
    // =================================================================================
    // [Picture] :picture
    //      -> to display a image.
    // Example:
    //     $.pixi.add(new Picture(filename, posX, posY, function() {
    //          [this] -> this of Picture function
    //          this.mouse.trigger.on = function(event) { this.sprite.scale.x *= 1.25; this.sprite.scale.y *= 1.25 }
    //     }))
    // =================================================================================
    function Picture() {
        this.initialize.apply(this, arguments);
    }
    //
    Picture.prototype = Object.create(Picture.prototype);
    Picture.prototype.constructor = Picture;
    // =================================================================================
    // [initialize]
    //      -> filename -> [String]
    //      -> x | y -> [Number] 
    //      -> callBack -> [function]
    // =================================================================================
    Picture.prototype.initialize = function(filename, x, y, callBack) {
        // arguments info
        this._filename = filename;
        this._x = Graphics.pageToCanvasX(x);
        this._y = Graphics.pageToCanvasX(y);
        this._loaded = false;
        this._callBack = callBack;
        // mouse function
        this.mouse = $._setupMouse();
        // load-on
        const loader = PIXI.loader;
        loader.add({
            name: 'picture',
            url: this._filename,
        }, function() {
            // complete load
            this.sprite = new PIXI.Sprite.fromImage(this._filename); 
            this.sprite.visible = false;
            SceneManager._scene.addChild(this.sprite);
            // setup after loaded
            this.setup();
        }.bind(this));
        loader.load();
    }
    // =================================================================================
    // [setup] : after load, setup of picture
    // =================================================================================
    Picture.prototype.setup = function() {
        this._loaded = true;
        this.sprite.x = this._x;
        this.sprite.y = this._y;
        this.sprite.interactive = true;
        this.sprite.interactiveChildren = true;
        this.sprite.renderable = true;
        this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        this.sprite.visible = true;
        // callback
        if (typeof this._callBack === 'function')  this._callBack.apply(this);
    }
    // =================================================================================
    // [dispose] : destroy the object
    // =================================================================================
    Picture.prototype.dispose = function() { 
        if (this._loaded)
            this.sprite.destroy(); 
    }
    // =================================================================================
    // [update] : update 
    // =================================================================================
    Picture.prototype.update = function() {
        if (this._loaded) {
            this.sprite.updateTransform();
            Graphics.render(this.sprite);
            //this.sprite.hitArea.x = this.sprite.x - ( (this.sprite.x * this.sprite.scale.x) / 2 );
            //this.sprite.hitArea.y = this.sprite.y - ( (this.sprite.y * this.sprite.scale.y) / 2 );
            //this.sprite.hitArea.width = this.sprite.width + ( (this.sprite.width * this.sprite.scale.x) / 2);
            //this.sprite.hitArea.height = this.sprite.height + ( (this.sprite.height * this.sprite.scale.y) / 2);
            this.sprite.hitArea.x = this.sprite.x;
            this.sprite.hitArea.y = this.sprite.y;
            // get the mouse position
            this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
            this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
            // check out if the mouse will be used on
            if (this.mouse.active) {
                this.mouseSetup();
            }
        }
    }
    // =================================================================================
    // [_mouseOver] : check out if the mouse is over
    // =================================================================================
    Picture.prototype._mouseOver = function() {
        if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
        if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
            if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                return true;
            }
        }
        return false; 
    }
    // =================================================================================
    // [mouseSetup] : run all functions and settings about the Mouse.
    // =================================================================================
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
    // =================================================================================
    // [PixiManager] :pixi
    // =================================================================================
    function PixiManager() {
        this.initialize.apply(this, arguments);
    }
    // =================================================================================
    PixiManager.prototype = Object.create(PixiManager.prototype);
    PixiManager.prototype.constructor = PixiManager;
    // =================================================================================
    // [initialize]
    // =================================================================================
    PixiManager.prototype.initialize = function() {
        this.data = this.data || [];
    }
    // =================================================================================
    // [dispose] : destroy all objects that exist
    // =================================================================================
    PixiManager.prototype.dispose = function() {
        this.data.forEach(function(current, index, array) {
            if (current.dispose) {
                current.dispose();
            }
        })
        this.data = [];
    }
    // =================================================================================
    // [update] : update all objects that exist
    // =================================================================================
    PixiManager.prototype.update = function() {
        this.data.forEach(function(item, index) {
            if (item.update) {
                item.update();
            }
        })
    }
    // =================================================================================
    // [add] : push a element to data.
    //      -> pixi -> element to data.
    //      -> index -> if null, push. If set up, setup the index of data.
    // =================================================================================
    PixiManager.prototype.add = function(pixi, index) {
        if (pixi !== undefined) {
            if (index === undefined) {
                this.data.push(pixi);
            } else {
                this.data[index] = pixi;
            }
        }
    }
    // =================================================================================
    // [off] : remove a element from data
    //      -> index -> index from element that will be destroyed
    // =================================================================================
    PixiManager.prototype.off = function(index) {
        if (Number.isInteger(index)) {
            if (this.data[index]) {
                this.data[index].destroy();
                this.data.splice(index, 1);
            }
        }
    }
    // =================================================================================
    // [Scene_Base] :scene_base
    // =================================================================================
    // [start]
    // =================================================================================
    $._aliasStart_SB = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        $.pixi = $.pixi || new PixiManager();
        $._aliasStart_SB.call(this);
    }
    // =================================================================================
    // [update]
    // =================================================================================
    $._aliasUpdt_SB = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        $._aliasUpdt_SB.call(this);
        $.pixi.update();
    }
    // =================================================================================
    // [terminate]
    // =================================================================================
    $._aliasTerm_SB = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        $._aliasTerm_SB.call(this);
        $.pixi.dispose();
    }
    
    // Teste
    $._aliasCreate_ST = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        $._aliasCreate_ST.call(this);
        $.pixi.add(new Picture("img/sv_enemies/Actor1_3.png", 0, 0, function(event) {
            this.mouse.over = function(_mouseover) { this.sprite.alpha = 0.5; }
            this.mouse.out = function(_mouseout) { this.sprite.alpha = 1; }
        }));

        $.pixi.add(new Text("testando", 500, 50, function(event) {
            this.sprite.style = {
                stroke: '#4a1850',
                fill: ['#ffffff', '#00ff99'], // gradient
            }
            this.mouse.over = function(_mouseover) { this.sprite.alpha = 0.5; }
            this.mouse.out = function(_mouseout) { this.sprite.alpha = 1; }
        }))
    }
})(Haya.Core);
Imported.Haya = true;
