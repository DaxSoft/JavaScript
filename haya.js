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
 * 
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
    :picture_manager
    :scene
*/

// $main$
(function($){
'use strict';
    // [isScene(scene_name)] :scene
    SceneManager.prototype.isScene = function(name) {
        var scene = SceneManager._scene;
        return scene && scene.constructor === name;
    }
    // [Pixi] :picture
    function Picture() {
        this.initialize.apply(this, arguments);
    }
    //
    Picture.prototype = Object.create(Picture.prototype);
    Picture.prototype.constructor = Picture;
    // addChildAt
    Picture.prototype.initialize = function(filename, x, y, childAt) {
        this.x = x;
        this.y = y; 
        this.anchor = 0.5;
        this.sprite = new PIXI.Sprite.fromImage(filename);
        this.sprite.anchor.set(this.anchor);
        this.sprite.interactive = true;
        this.sprite.interactiveChildren = true;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        if (Number.isInteger(childAt)) {
            SceneManager._scene.addChildAt(this.sprite, childAt);
        } else {
            SceneManager._scene.addChild(this.sprite)
        }
    }
    // dispose
    Picture.prototype.dispose = function() { this.sprite.destroy(); }
    // get the width
    Picture.prototype.width = function() { return (this.sprite.width); }
    // get the height
    Picture.prototype.height = function() { return (this.sprite.height); }
    // scale
    Picture.prototype.scale = function(x, y) { this.sprite.scale = new PIXI.Point(x, y); }
    // visible
    Picture.prototype.visible = function(value) { this.sprite.visible = value; }
    // transform:
    // pos / scale / skew / pivot is Array : [x, y]
    Picture.prototype.transform = function(x, y, sx, sy, rotation, skx, sky, px, py) {
        this.sprite.setTransform(x, y, sx, sy, rotation, skx, sky, px, py);
    }
    // update
    Picture.prototype.update = function() {
        this.sprite.updateTransform();
    }
    // 
    /*
        from: http://pixijs.download/release/docs/PIXI.Sprite.html
        sprite.alpha = 0.0 - 1.0; <Opacity>
        sprite.rotation = value; <Angle>
        sprite.blendMode = PIXI.BLEND_MODES
                                . NORMAL, ADD, MULTIPLY, SCREEN, OVERLAY, DARKEN, LIGHTEN, COLOR_DODGE, HARD_LIGHT, DIFFERENCE, 
                                  EXCLUSION, HUE, SATURATION, COLOR, LUMONISITY
        sprite.buttonMode = true/false
        sprite.cacheAsBitmap(true/false)
        sprite.children
        *** hitArea ***
        sprite.interactive = true;
        sprite.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
        ***
        sprite.renderable = true/false
        sprite.scale = new PIXI.Point(x, y);
        sprite.tint = 0xFFFFFF;
        
    */
    // [PictureManager] :picture_manager
    function PictureManager() {
        this.initialize.apply(this, arguments);
    }
    //
    PictureManager.prototype = Object.create(PictureManager.prototype);
    PictureManager.prototype.constructor = PictureManager;
    // initialize
    PictureManager.prototype.initialize = function() {
        this.data = this.data || [];
    }
    // dispose
    PictureManager.prototype.dispose = function() {
        this.data.forEach(function(current, index, array) {
            if (current && current.constructor == Picture) {
                current.dispose();
            }
        })
        this.data = [];
    }
    // update
    PictureManager.prototype.update = function() {
        this.data.forEach(function(item, index) {
            if (item.update) {
                item.update();
            }
        })
    }
    // add-on
    PictureManager.prototype.add = function(picture, index) {
        if (picture && picture.constructor == Picture) {
            if (index === undefined) {
                this.data.push(picture);
            } else {
                this.data[index] = picture;
            }
        }
    }
    // off
    PictureManager.prototype.off = function(index) {
        if (Number.isInteger(index)) {
            if (this.data[index] && this.data[index].constructor == Picture) {
                this.data[index].destroy();
                this.data.splice(index, 1);
            }
        }
    }
    // get a data: .data[index]

    // [Scene_Base] // Yeah, i would use call() if you want to pass specific parameters. apply() is better suited to just pass everything along.
    $._aliasStart_SB = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        $._aliasStart_SB.call(this);
        $.pictureManager = $.pictureManager || new PictureManager();
    }
    // update
    $._aliasUpdt_SB = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        $._aliasUpdt_SB.call(this);
        $.pictureManager.update();
    }
    // terminate
    $._aliasTerm_SB = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        $._aliasTerm_SB.call(this);
        $.pictureManager.dispose();
    }
    
    // Teste
    $._aliasCreate_ST = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        $._aliasCreate_ST.call(this);
        $.pictureManager.add(new Picture("img/sv_enemies/Actor1_3.png", 300, 300))
    }
})(Haya.Core);
Imported.Haya = true;
