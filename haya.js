// ================================================================================
// Plug-in    : Haya Core
// Author     : Dax Soft | Kvothe
// Website    : www.dax-soft.weebly.com
// Version    : 0.1.0
// ================================================================================

/*:
 * @author: Dax Soft | Kvothe
 * 
 * @plugindesc [Haya]
 * Essential core for my script to MV.
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
 * in other scripts |$.pixi| to |Haya.Core.pixi|
 * ================================================================================
 * 0.1.0 :
 *  - some functions from ruby to javascript
 *  - some functions from PIXI for easy manager as display picture, text.
 * ================================================================================
 * 
*/
// setTimeout(function(), time)
var Imported = Imported || {};
var Haya = Haya || {};
Haya.Core = Haya.Core || {};
Haya.Core.Version = 0.1;

/* ================================================================================
Ctrl+F [locate]:
    :math
    :number
    :input
    :opacity
    :move
    :picture
    :text
    :pixi [pixi manager]
    :scene
================================================================================ */

// =================================================================================
// [Global function]
// =================================================================================
function Picture() { this.initialize.apply(this, arguments); }
function Movie() { this.initialize.apply(this, arguments); }
function Text() { this.initialize.apply(this, arguments); }
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
// $main$
(function($){
'use strict';
    // =================================================================================
    // [Parameters]:
    // =================================================================================
    $.parameters = {};
    $.math = {};
    $.pixi = null;
    $.position = {};
    $.key = {}
    $.listeners = {};
    $.opacity = {};
    $.move = {};
    $.get = {};
    // =================================================================================
    // [get-current] :get
    //      get the current filename script
    //      filename : if it is true, just the filename.
    // =================================================================================
    $.get.current = function(filename) {
        let current = document.currentScript.src;
        if (filename) current = current.split('/').pop();
        return current;
    }
    // =================================================================================
    // [get-indexObject] 
    //      object : object value
    //      element : element that will return the index value
    //   get -1 if it is not return
    // =================================================================================
    $.get.indexObject = function(object, element) {
        var value = -1;
        Object.keys(object).map(function(key, index, array) {
            if (array[index] === element) {
                value = index;
            }
        })
        return value;
    }
    // =================================================================================
    // [math-percentTo] :math
    //      current : 
    //      x : min value
    //      y : max value
    // =================================================================================
    $.math.percentTo = function(current, x, y) {
        current = (current * x) / y;
        return current; 
    }
    // =================================================================================
    // [math-toPercent] 
    //      current : 
    //      x : max value
    // =================================================================================
    $.math.toPercent = function(current, x) {
        current = (current * x) / 100;
        return current; 
    }
    // =================================================================================
    // [math-rand] 
    //      get a random number between x and y
    // =================================================================================
    $.math.rand = function (min, max) {
        return Math.random() * (max - min) + min;
    }
    // =================================================================================
    // [math-randInt] 
    //      get a random number between x and y | (0,2)=0,1
    // =================================================================================
    $.math.randInt = function (min, max) {
        min = Math.ceil(min); max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // =================================================================================
    // [math-randomic] 
    //      current : 
    //      x : variation of value 
    //      round : if true 
    // =================================================================================
    $.math.randomic = function(current, x, round) {
        this._random = $.math.randInt(0, 2) === 0 ? $.math.rand(0, x) : -$.math.rand(0, x);
        current = (current + $.math.rand(0, 2)) + (current + this._random);
        current = round ? Math.round(current) : current;
        return current / 2;
    }
    // =================================================================================
    // [press any key of keyboard] :input
    // =================================================================================
    $.key.anyBoard = function() {
        var _switch = false;
        Object.keys(Input.keyMapper).map(function(key, index) {
            if (Input.isPressed(Input.keyMapper[key])) _switch = true;  
        })
        return _switch;
    }
    // =================================================================================
    // [press any key of gamepad]
    // =================================================================================
    $.key.anyGamepad = function() {
        var _switch = _switch || false;
        Object.keys(Input.gamepadMapper).map(function(key, index) {
            if (Input.isPressed(Input.gamepadMapper[key])) _switch = true;  
        })
        return _switch;
    }
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
    $.parameters._setupMouse = function() {
        return ({
            x: 0,
            y: 0,
            active: false,
            over: null,
            out: null, 
            trigger: {on: null, off: null},
            press: {on: null, off: null},
            repeat: {on: null, off: null},
            drag: {active: true, start: false, function: null}
        });
    }
    // =================================================================================
    // [setup of position at screen]
    //      -> type -> default position type
    //      -> width -> width of object
    //      -> height -> height of object
    // =================================================================================
    $.position.screen = function(type, width, height) {
        // default point
        this._point = new Point(0, 0);
        // type
        switch (type) {
            // at center of screen
            case "center": 
                this._point.x = (Graphics.boxWidth - width) / 2;
                this._point.y = (Graphics.boxHeight - height) / 2;
                break;
            // at left center of screen
            case "center-left":
                this._point.y = (Graphics.boxHeight - height) / 2;
                break;
            // at right center of screen
            case "center-right":
                this._point.x = Graphics.boxWidth - width;
                this._point.y = (Graphics.boxHeight - height) / 2;
                break;
            // at top center of screen
            case "center-top":
                this._point.x = (Graphics.boxWidth - width) / 2;
                break;
            // at bottom center of screen
            case "center-bottom":
                this._point.x = (Graphics.boxWidth - width) / 2;
                this._point.y = Graphics.boxHeight - height;
                break;
            // at upper-right of screen
            case "upper-right":
                this._point.x = Graphics.boxWidth - width;
                break;
            // at bottom-right of screen
            case "bottom-right":
                this._point.x = Graphics.boxWidth - width;
                this._point.y = Graphics.boxHeight - height;
                break;
            // at bottom-left of screen
            case "bottom-left":
                this._point.y = Graphics.boxHeight - height;
                break;
            default: 
                break;
        }
        // return
        return this._point;
    }
    // =================================================================================
    // [setup of position at another object]
    //      -> type -> default position type
    //      -> a -> first object, that will change the position |need have x, y, width, height|
    //      -> b -> second object, that will be the reference point |need have x, y, width, height|
    // =================================================================================
    $.position.object = function(type, a, b) {
        // default point
        this._point = new Point(a.x, a.y);
        // type
        switch (type) {
            // at center of object
            case "center":
                this._point.x = b.x + (b.width - a.width) / 2;
                this._point.y = b.y + (b.height - a.height) / 2;
                break;
            // at center top of object
            case "center-top":
                this._point.x = b.x + (b.width - a.width) / 2;
                this._point.y = b.y;
                break;
            // at center left of object
            case "center-left":
                this._point.x = b.x;
                this._point.y = b.y + (b.height - a.height) / 2;
                break;
            // at center right of object
            case "center-right":
                this._point.x = b.x + a.width;
                this._point.y = b.y + (b.height - a.height) / 2;
                break;
            // at upper-left of object
            case "upper-left":
                this._point.x = b.x;
                this._point.y = b.y - b.height;
                break;
            // at bottom-left of object
            case "bottom-left":
                this._point.x = b.x;
                this._point.y = b.y + b.height;
                break;
            // at upper-right of object
            case "upper-right":
                this._point.x = b.x + b.width;
                this._point.y = b.y - b.height;
                break;
            // at bottom-right of object
            case "upper-right":
                this._point.x = b.x + b.width;
                this._point.y = b.y + b.height;
                break;
            // default
            default: 
                break;
        }
        // return 
        return this._point;
    }
    // =================================================================================
    // [opacity-loop] :opacity | new $.opacity.loop(hash).value(current)
    //  - object |hash|
    //      - alpha | opacity value
    //      - maximun 
    //      - minimun
    //      - speed
    // =================================================================================
    $.opacity.loop = class {
        // constructor
        constructor(hash) {
            this._max = hash.max === undefined ? 1 : hash.max;
            this._min = hash.min === undefined ? 0.5 : hash.min; 
            this._speed = hash.speed === undefined ? 0.01 : hash.speed;
        }
        // value
        value(current) {
            // work out
            if (this._switch) {
                if (current <= this._min) {
                    this._switch = false; 
                } else {
                    current -= this._speed;
                }
            } else {
                if (current >= this._max) {
                    this._switch = true; 
                } else {
                    current += this._speed;
                }
            }
            return current;
        }
    }
    // =================================================================================
    // [move-linear] :move
    //  hash :
    //      - current : current value
    //      - goal : the value that will reach
    //      - speed
    //      - type : default is 'forward'
    //          - 'forward' | 0 : go ahead
    //          - 'back' | 1 : go back
    //      - kind : default is normal
    //          - 'normal' | 0 : until reach the gaol value
    //          - 'smooth' | 1 : until reach the goal value with smoothing
    // =================================================================================
    $.move.linear = class {
        // constructor
        constructor(hash) {
            if (hash.goal === undefined) return hash.current;
            this.speed = hash.speed === undefined ? 1.0 : hash.speed;
            this.type = hash.type === undefined ? 'forward' : hash.type;
            this.kind = hash.kind === undefined ? 'smooth' : hash.kind;
            this.goal = hash.goal;
            if (this.goal === undefined) this.done = true;
            if (this.kind === 'smooth' || this.kind === 1) this.speed *= 1.75;
            this._boost = Math.PI;
        }
        // value
        value(current) {
            if (this.done) return current;
            // forward
            if (this.type === 'forward' || this.type === 0) {
                // normal type
                if (this.kind === 'normal' || this.kind === 0) {
                    if (current <= this.goal) {current += this.speed;}  else {this.done = true;}
                // smooth
                } else if (this.kind === 'smooth' || this.kind === 1) {
                    if (current <= this.goal)  {
                        this._boost = Math.ceil(-$.math.percentTo(this._boost, current, this.goal*2));
                        current += (this.speed + this._boost); 
                    } else {this.done = true;}
                }
            // back
            } else if (this.type === 'back' || this.type === 1) {
                // normal type
                if (this.kind === 'normal' || this.kind === 0) { 
                    if (current >= this.goal) {current -= this.speed;} else {this.done = true;}
                // smooth
                } else if (this.kind === 'smooth' || this.kind === 1) {
                    if (current >= this.goal)  {
                        this._boost = Math.ceil(-$.math.percentTo(this._boost, this.goal, current*2));
                        current -= (this.speed + this._boost); 
                    } else { this.done = true; }
                }
            // go to forward
            }
            return current;
        }
    }
    // =================================================================================
    // [move-loop] 
    //  hash :
    //      - current : current value
    //      - max : in relation to current value (current + max)
    //      - min : in relation to current value (current - min)
    //      - speed 
    //      - kind : default is normal
    //          - 'normal' | 0 : until reach the min&max value
    // =================================================================================
    $.move.loop = class {
        // constructor
        constructor(hash) {
            hash.max = hash.max || 5;
            hash.min = hash.min || 5;
            this.speed = hash.speed === undefined ? 0.5 : hash.speed;
            this.kind = hash.kind === undefined ? 'normal' : hash.kind;
            this.current = this.current || hash.current;
            this.max = this.current + Math.abs(hash.max);
            this.min = this.current - Math.abs(hash.min);
        }
        // value
        value(current) {
            // normal type
            if (this.kind === 'normal' || this.kind === 0) {
                // go to max
                if (this.between) {
                    if (current <= this.max) { current += this.speed; } else { this.between = false; };
                // go to min
                } else {
                    if (current >= this.min) { current -= this.speed; } else { this.between = true; };
                }
            }
            // return 
            return Math.fround(current);
        }
    }
    // =================================================================================
    // [move-bounce] 
    //  hash :
    //      current :
    //      time : time of fall
    //      speed
    //      gravity
    // =================================================================================
    $.move.bounce = class {
        // constructor
        constructor(hash) {
            hash.time = hash.time || 5;
            this.time = this.time || hash.time;
            this.speed = hash.speed || 0.1;
            hash.gravity = hash.gravity || 9.8;
            this.gravity = this.gravity || hash.gravity;
            this.height = this.height || hash.current;
        };
        // get
        value(current) {
            if (this.done === 1) return (current);
            if (this.time <= 0.1) {
                this.gravity -= (this.speed * 10);
                this.time =  this.gravity / Math.PI;
            } else { this.time -= this.speed; }
            current = this.height - (0.5 * this.gravity * (Math.pow(this.time, 2)))
            if (this.gravity <= 0.1) this.done = 1;
            return current;
        };
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
    Text.prototype.initialize = function(text, x, y, callBack, childAt) {
        // arguments info
        this._text = text;
        this._x = Graphics.pageToCanvasX(x);
        this._y = Graphics.pageToCanvasX(y);
        this._loaded = false;
        this._callBack = callBack;
        this._afterUpdate = null;
        this._preUpdate = null;
        // mouse function
        this.mouse = $.parameters._setupMouse();
        // load
        this.sprite = new PIXI.Text(this._text);
        if (childAt === undefined) {
            SceneManager._scene.addChild(this.sprite);
        } else { SceneManager._scene.addChildAt(this.sprite, childAt) }
        this.sprite.x = this._x;
        this.sprite.y = this._y;
        this.sprite.interactive = true;
        this.sprite.interactiveChildren = true;
        this.sprite.renderable = true;
        this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        // callback
        if (typeof this._callBack === 'function')  this._callBack.apply(this, arguments);
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
        // get the mouse position
        this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
        this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
        // check out if the mouse will be used on
        if (this.mouse.active) {
            this.mouseSetup();
        }
        // afterUpdate
        if (typeof this._afterUpdate === 'function')  this._afterUpdate.apply(this, arguments);
    }
    // =================================================================================
    // [position] : library of position to class
    // =================================================================================
    Text.prototype.position = function(type) {
        var _position = $.position.screen(type, this.sprite.width, this.sprite.height);
        this.sprite.x = _position.x;
        this.sprite.y = _position.y;
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
    // [Movie] :movie
    // =================================================================================
    Movie.prototype = Object.create(Movie.prototype);
    Movie.prototype.constructor = Movie;
    // =================================================================================
    // initialize
    // =================================================================================
    Movie.prototype.initialize = function(filename, callBack) {
        // setup
        this._filename = filename + Game_Interpreter.prototype.videoFileExt();
        this._texture = PIXI.Texture.fromVideo(this._filename, PIXI.SCALE_MODES.LINEAR);
        this._loaded = false;
        this._callBack = callBack;
        this._afterUpdate = null;
        this._preUpdate = null;
        // test
        this.sprite = new PIXI.Sprite(this._texture);
        this.sprite.width = Graphics.boxWidth;
        this.sprite.height = Graphics.boxHeight;
        // updated the texture
        this.sprite.update = function update () { 
            this._texture.update(); 
        }
        // eternal loop
        this.sprite.texture.baseTexture.source.loop = true;
        // callback
        if (typeof this._callBack === 'function')  this._callBack.apply(this, arguments);
        SceneManager._scene.addChild(this.sprite);
    }
    // =================================================================================
    // dispose
    // =================================================================================
    Movie.prototype.dispose = function() {
        this.sprite.destroy(true);
        this.source.pause();
        this.source.remove();
        this.source = null;
    }
    // =================================================================================
    // update
    // =================================================================================
    Movie.prototype.update = function () {
        // preUpdate
        if (typeof this._preUpdate === 'function')  this._preUpdate.apply(this, arguments);
        //Graphics.render(this.sprite);
        // afterUpdate
        if (typeof this._afterUpdate === 'function')  this._afterUpdate.apply(this, arguments);
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
    //
    Picture.prototype = Object.create(Picture.prototype);
    Picture.prototype.constructor = Picture;
    // =================================================================================
    // [initialize]
    //      -> filename -> [String]
    //      -> x | y -> [Number] 
    //      -> callBack -> [function]
    // =================================================================================
    Picture.prototype.initialize = function(filename, x, y, callBack, childAt) {
        // arguments info
        this.childAt = childAt;
        this._filename = filename;
        this._x = Graphics.pageToCanvasX(x);
        this._y = Graphics.pageToCanvasX(y);
        this._loaded = false;
        this._callBack = callBack;
        this._afterUpdate = null;
        this._preUpdate = null;
        // mouse function
        this.mouse = $.parameters._setupMouse();
        // load-on
        const loader = new PIXI.loaders.Loader();
        loader.add({
            name: 'picture',
            url: this._filename,
        }, function() {
            // complete load
            this.sprite = new PIXI.Sprite.fromImage(this._filename); 
            this.sprite.visible = false;
            if (this.childAt === undefined) {
                SceneManager._scene.addChild(this.sprite);
            } else { SceneManager._scene.addChildAt(this.sprite, this.childAt) }
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
        if (typeof this._callBack === 'function')  this._callBack.apply(this, arguments);
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
            // get the mouse position
            this.mouse.x = Graphics.pageToCanvasX(TouchInput.x);
            this.mouse.y = Graphics.pageToCanvasY(TouchInput.y);
            // check out if the mouse will be used on
            if (this.mouse.active) {
                this.mouseSetup();
            }
            // afterUpdate
            if (typeof this._afterUpdate === 'function')  this._afterUpdate.apply(this);
        }
    }
    // =================================================================================
    // [position] : library of position to class
    // =================================================================================
    Picture.prototype.position = function(type) {
        var _position = $.position.screen(type, this.sprite.width, this.sprite.height);
        this.sprite.x = _position.x;
        this.sprite.y = _position.y;
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
        this.data = this.data || {};
    }
    // =================================================================================
    // [dispose] : destroy all objects that exist
    // =================================================================================
    PixiManager.prototype.dispose = function() {
        if ((this.data === undefined) || (typeof this.data !== 'object')) return;
        Object.keys(this.data).map(function(key, index) {
            if (this.data[key].dispose)
                this.data[key].dispose();
        }.bind(this))
        this.data = {};
    }
    // =================================================================================
    // [update] : update all objects that exist
    // =================================================================================
    PixiManager.prototype.update = function() {
        if ((this.data === undefined) && (typeof this.data !== 'object')) return;
        Object.keys(this.data).map(function(key, index) {
            if (this.data[key].update)
                this.data[key].update();
        }.bind(this))
    }
    // =================================================================================
    // [add] : push a element to data.
    //      -> pixi -> element to data.
    //      -> index -> if null, push. If set up, setup the index of data.
    // =================================================================================
    PixiManager.prototype.add = function(pixi, index) {
        if (pixi !== undefined) {
            this.data[index] = pixi;
        }
    }
    // =================================================================================
    // [off] : remove a element from data
    //      -> index -> index from element that will be destroyed
    // =================================================================================
    PixiManager.prototype.off = function(index) {
        if (this.data[index] !== undefined) {
            this.data[index].dispose();
            delete this.data[index];
        }
    }
    // check out if the last added was loaded
    PixiManager.prototype.lastLoaded = function() {
        if (this.data.pop() === undefined) return false;
        if (this.data.pop()._loaded) return true;
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
    // SwapChildren
    PixiManager.prototype.swapChildren = function(childA, childB, condition) {
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
    $.pixi = $.pixi || new PixiManager();
    // =================================================================================
    // [Scene_Base] :scene_base
    // =================================================================================
    // [start]
    // =================================================================================
    $._aliasStart_SB = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
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
})(Haya.Core);
Imported.Haya = true;
