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
 * @param << Screen >>
 * @default
 *
 * @param Screen Width
 * @parent << Screen >> 
 * @type number
 * @min 0
 * @desc Adjusts the width of the screen.
 * Default: 1040
 * @default 1040
 *
 * @param Screen Height
 * @parent << Screen >> 
 * @type number
 * @min 0
 * @desc Adjusts the height of the screen.
 * Default: 780
 * @default 780
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

/*
Ctrl+F locate:
    :picture
    :text
    :pixi [pixi manager]
    :scene
*/

// $main$
(function($){
'use strict';
    // extension - number
    if (typeof Number.prototype.isBetween === 'undefined') {
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
    // touchInput
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
    // [isScene(scene_name)] :scene
    SceneManager.prototype.isScene = function(name) {
        var scene = SceneManager._scene;
        return scene && scene.constructor === name;
    }
    // [Pixi] :text
    function Text() {
        this.initialize.apply(this, arguments);
    }
    // init
    Text.prototype = Object.create(Text.prototype);
    Text.prototype.constructor = Text;
    /*
    var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440
    });
    */
    // initialize
    Text.prototype.initialize = function(text, x, y, callBack) {
        // arguments info
        this._text = text;
        this._x = Graphics.pageToCanvasX(x);
        this._y = Graphics.pageToCanvasX(y);
        this._loaded = false;
        this._callBack = callBack;
        // mouse function
        this.mouse = {};
        this.mouse.x = 0;
        this.mouse.y = 0;
        this.mouse.active = true; 
        this.mouse.over = null;
        this.mouse.out = null;
        this.mouse.trigger = {};
        this.mouse.trigger.on = null;
        this.mouse.trigger.off = null;
        this.mouse.press = {};
        this.mouse.press.on = null;
        this.mouse.press.off = null;
        this.mouse.repeat = {};
        this.mouse.repeat.on = null;
        this.mouse.repeat.off = null;
        this.mouse.drag = {};
        this.mouse.drag.active = true;
        this.mouse.drag.start = false;
        this.mouse.drag.function = null;
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
    // dispose
    Text.prototype.dispose = function() {
        if (this.sprite.destroy)
            this.sprite.destroy();
    }
    // update
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
    // mouse over sprite?
    Text.prototype._mouseOver = function() {
        if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
        if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
            if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                return true;
            }
        }
        return false; 
    }
    // mouse Setup
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
    // [Pixi] :picture
    function Picture() {
        this.initialize.apply(this, arguments);
    }
    //
    Picture.prototype = Object.create(Picture.prototype);
    Picture.prototype.constructor = Picture;
    // initialize
    Picture.prototype.initialize = function(filename, x, y, callBack) {
        // arguments info
        this._filename = filename;
        this._x = Graphics.pageToCanvasX(x);
        this._y = Graphics.pageToCanvasX(y);
        this._loaded = false;
        this._callBack = callBack;
        // mouse function 
        this.mouse = {};
        this.mouse.x = 0;
        this.mouse.y = 0;
        this.mouse.active = true; 
        this.mouse.over = null;
        this.mouse.out = null;
        this.mouse.trigger = {};
        this.mouse.trigger.on = null;
        this.mouse.trigger.off = null;
        this.mouse.press = {};
        this.mouse.press.on = null;
        this.mouse.press.off = null;
        this.mouse.repeat = {};
        this.mouse.repeat.on = null;
        this.mouse.repeat.off = null;
        this.mouse.drag = {};
        this.mouse.drag.active = true;
        this.mouse.drag.start = false;
        this.mouse.drag.function = null;
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
    // setup 
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
    // dispose
    Picture.prototype.dispose = function() { 
        if (this._loaded)
            this.sprite.destroy(); 
    }
    // update
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
    // mouse over sprite?
    Picture.prototype._mouseOver = function() {
        if (!Graphics.isInsideCanvas(this.mouse.x, this.mouse.y)) return false;
        if (this.mouse.x.isBetween(this.sprite.hitArea.x, this.sprite.hitArea.x + this.sprite.hitArea.width)) {
            if (this.mouse.y.isBetween(this.sprite.hitArea.y, this.sprite.hitArea.y + this.sprite.hitArea.height)) {
                return true;
            }
        }
        return false; 
    }
    // mouse Setup
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
    // 
    // [PixiManager] :pixi
    function PixiManager() {
        this.initialize.apply(this, arguments);
    }
    //
    PixiManager.prototype = Object.create(PixiManager.prototype);
    PixiManager.prototype.constructor = PixiManager;
    // initialize
    PixiManager.prototype.initialize = function() {
        this.data = this.data || [];
    }
    // dispose
    PixiManager.prototype.dispose = function() {
        this.data.forEach(function(current, index, array) {
            if (current.dispose) {
                current.dispose();
            }
        })
        this.data = [];
    }
    // update
    PixiManager.prototype.update = function() {
        this.data.forEach(function(item, index) {
            if (item.update) {
                item.update();
            }
        })
    }
    // add-on
    PixiManager.prototype.add = function(pixi, index) {
        if (pixi !== undefined) {
            if (index === undefined) {
                this.data.push(pixi);
            } else {
                this.data[index] = pixi;
            }
        }
    }
    // off
    PixiManager.prototype.off = function(index) {
        if (Number.isInteger(index)) {
            if (this.data[index]) {
                this.data[index].destroy();
                this.data.splice(index, 1);
            }
        }
    }
    // get a data: .data[index]

    // [Scene_Base] // Yeah, i would use call() if you want to pass specific parameters. apply() is better suited to just pass everything along.
    $._aliasStart_SB = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        $.pixi = $.pixi || new PixiManager();
        $._aliasStart_SB.call(this);
    }
    // update
    $._aliasUpdt_SB = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        $._aliasUpdt_SB.call(this);
        $.pixi.update();
    }
    // terminate
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
