// ================================================================================
// Plug-in    : Haya Scene 
// Author     : Dax Soft | Kvothe
// Website    : www.dax-soft.weebly.com
// Version    : 0.1.0
// ================================================================================

/*:
 * @author: Dax Soft | Kvothe
 * 
 * @plugindesc 
 * <Haya Screen>
 * Scene & Menu plugins to Haya System.
 * 
 * @help
 * ================================================================================
 * ...
 * ================================================================================
 * 
*/


var Imported = Imported || {};
var Haya = Haya || {};
Haya.Scene = Haya.Scene || {};

/* ================================================================================
Ctrl+F [locate]:
    :boot
    :title
    :splash
================================================================================ */
// $main$
(function($){
'use strict';
    // =================================================================================
    // [Parameters]:
    // =================================================================================
    $.parameters = {
        // general:
        general: {
            // cursor picture
            cursor: {
                speed: 0.02,
                picture: "img/system/cursor.png",
            },
        },
        // splash paramaters
        splash: {
            // speed of transition
            speed: 0.02,
            // pictures
            pictures: ["img/system/MadeWithMv.png", "img/system/hayasplash.png"], // 

        },
        // title parameters
        title: {
            // sound
            sound: {
                filename: "audio/bgm/clair de lune.mp3"
            },
            // text
            text: {
                string: "Scene Title from Haya System. Background movie from youtube canal, Des Stewart.",
                version: "v0.1.0",
                style: {
                    align: "center",
                    fill: "white",
                    fontSize: 14,
                    fontFamily: "Antipasto",
                    stroke: "black",
                    strokeThickness: 1,
                },
            },
            // logo
            logo: {
                picture: "img/system/logo.png"
            },
            // back of logo
            back: "img/system/logo_back.png",
            // movie background
            movie: {
               filename: "movies/intro",
               volume: 0.25,
            },
            // options
            option: {
                // space
                space: 24,
                // set up options
                list: {
                    "NEW GAME": "SceneManager._scene.newGame()",
                    "CONTINUE": "SceneManager._scene.commandContinue()",
                    "OPTIONS": "",
                    "EXIT": "SceneManager.terminate()",
                },
                // normal style
                normal: {
                    align: "center",
                    fontSize: 16,
                    fontFamily: "Antipasto",
                    fill: "white",
                },
                // on
                off: { fill: "white" },
                // off
                on: { fill: "#f5a700" },
            }
        },
    };
    // =================================================================================
    // [Scene_Boot] :boot
    // =================================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()) {
            SceneManager.goto(Scene_Splash);
        } else {
            _Scene_Boot_start.call(this);
        }
    };
    // =================================================================================
    // [Scene_Splash] :splash
    // =================================================================================
    function Scene_Splash() {
        this.initialize.apply(this, arguments);
    }
    Scene_Splash.prototype = Object.create(Scene_Base.prototype);
    Scene_Splash.prototype.constructor = Scene_Splash;
    // =================================================================================
    // [initialize]
    // =================================================================================
    Scene_Splash.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this._pictures = $.parameters.splash.pictures;
        this.ordem = 0;
        this._speed = $.parameters.splash.speed;
    }
    // =================================================================================
    // [createPictures]
    // =================================================================================
    Scene_Splash.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this._pictures.forEach(function(item, index) {
            Haya.Core.pixi.add(new Picture(item, 0, 0, function () {
                this._fade = false; 
                this.position("center");
                this.sprite.alpha = 0.0;
            }), index)
        })
    }
    // =================================================================================
    // [udate]
    // =================================================================================
    Scene_Splash.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (Haya.Core.key.anyBoard() || TouchInput.isTriggered()) this.endSplash();
        this.fade();
    }
    // =================================================================================
    // [fade]
    // =================================================================================
    Scene_Splash.prototype.fade = function() {
        if (Haya.Core.pixi.data[this.ordem]._loaded) {
            if (Haya.Core.pixi.data[this.ordem]._fade) {
                Haya.Core.pixi.data[this.ordem].sprite.alpha -= this._speed;
                if (Haya.Core.pixi.data[this.ordem].sprite.alpha <= 0.0)  {
                    this.ordem++;
                    if (Haya.Core.pixi.data[this.ordem] === undefined)  this.endSplash();
                }
            } else {
                Haya.Core.pixi.data[this.ordem].sprite.alpha += this._speed;
                if (Haya.Core.pixi.data[this.ordem].sprite.alpha >= 1.0) Haya.Core.pixi.data[this.ordem]._fade = true;
            }
        }
    }
    // =================================================================================
    // [endSplash]
    // =================================================================================
    Scene_Splash.prototype.endSplash = function() {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            
            SceneManager.goto(Scene_Map);
        } else {
            if ($dataSystem.startMapId === 0) {
                throw new Error('Player\'s starting position is not set');
            }
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Title);
            Window_TitleCommand.initCommandPosition();
        }
        document.title = $dataSystem.gameTitle;
    }
    // =================================================================================
    // [Scene_Title] :title
    // =================================================================================
    Scene_Title.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createLogo();
        this.createOption();
        this.createCursor();
        this.cursor = 0;
        this.moveOut = false;
    };
    // =================================================================================
    // [start]
    // =================================================================================
    Scene_Title.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    };
    // =================================================================================
    // [update]
    // =================================================================================
    Scene_Title.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        // change Cursor
        if (Input.isTriggered('down')) {
            this.cursor = this.cursor >= Object.keys( $.parameters.title.option.list).length-1 ? 0 : this.cursor + 1;
        } else if (Input.isTriggered('up')) {
            this.cursor = this.cursor <= 0 ? Object.keys( $.parameters.title.option.list).length-1 : this.cursor - 1;
        } else if (Input.isTriggered('ok')) {
            //eval($.parameters.title.option.list[SceneManager._scene.currentOption()._text]);
            this.moveOut = true;
        }
    };
    // =================================================================================
    // [terminate]
    // =================================================================================
    Scene_Title.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
    };
    // =================================================================================
    // [createBackground]
    // =================================================================================
    Scene_Title.prototype.createBackground = function() {
        // video
        Haya.Core.pixi.add(new Movie($.parameters.title.movie.filename, function(){
            // volume
            this.sprite.texture.baseTexture.source.volume = $.parameters.title.movie.volume;
            // afterUpdate
            this._afterUpdate = function () {
                if (SceneManager._scene.moveOut === false) return;
                Haya.Core.pixi.data['back'].sprite.alpha -= 0.005;
                this.sprite.scale.x += 0.001;
                this.sprite.scale.y += 0.001;
                if (Haya.Core.pixi.data['back'].sprite.alpha <= 0.0) {
                    eval($.parameters.title.option.list[SceneManager._scene.currentOption()._text]);
                }
            }
        }), 'movie')
    }
    // =================================================================================
    // [createLogo]
    // =================================================================================
    Scene_Title.prototype.createLogo = function() {
        // back logo
        Haya.Core.pixi.add(new Picture($.parameters.title.back, 0, 0, function() {
            // moviment
            this._moviment = new Haya.Core.move.linear({current: this.sprite.x, goal: 96});
            // alpha
            this.sprite.alpha = 0.75;
            // after update
            this._afterUpdate = function() {
                // moviment
                if (SceneManager._scene.moveOut) {
                    this._moviment.current = this.sprite.x;
                    this._moviment.goal = 0;
                    this._moviment.type = 1;
                }
                this.sprite.x = this._moviment.value(this.sprite.x);
            }
        }), 'back');
        // logo
        Haya.Core.pixi.add(new Picture($.parameters.title.logo.picture, 0, 48, function() {
            // alpha
            this.sprite.alpha = 1.0;
            // afterUpdate
            this._afterUpdate = function() {
                // if is loaded
                if (Haya.Core.pixi.data['back']._loaded) {
                    // x
                    this.sprite.x = Haya.Core.position.object("center", this.sprite, Haya.Core.pixi.data['back'].sprite).x;
                    if (SceneManager._scene.moveOut) this.sprite.alpha = Haya.Core.pixi.data['back'].sprite.alpha;
                }
            }
        }), 'logo', 10);
        // subtitle
        Haya.Core.pixi.add(new Text($.parameters.title.text.string, 0, 0, function() {
            // style
            this.sprite.style = $.parameters.title.text.style;
            // position
            this.position("bottom-right");
            this.sprite.y -= 12;
            this.sprite.x -= 16;
            this.loopOpacity = new Haya.Core.opacity.loop({});
            this._afterUpdate = function() {
                // opacity test
                if (SceneManager._scene.moveOut) {
                    this.sprite.alpha = Haya.Core.pixi.data['back'].sprite.alpha;
                    this.sprite.x += 2.5;
                } else {
                    this.sprite.alpha = this.loopOpacity.value(this.sprite.alpha);
                }
            }
        }), 'text')
        // version
        Haya.Core.pixi.add(new Text($.parameters.title.text.version, 0, 0, function() {
            // style
            this.sprite.style = $.parameters.title.text.style;
            // y
            this.sprite.y = Graphics.boxHeight - 48;
            // preUpdate
            this._preUpdate = function() {
                if (Haya.Core.pixi.data['back']._loaded) {
                    Haya.Core.pixi.swapChildren('version', 'back');
                    this._preUpdate = null;
                }
            }
            // after Update
            this._afterUpdate = function() {
                // if is loaded
                if (Haya.Core.pixi.data['back']._loaded) {
                    // x
                    this.sprite.x = Haya.Core.position.object("center", this.sprite, Haya.Core.pixi.data['back'].sprite).x;
                    if (SceneManager._scene.moveOut) this.sprite.alpha = Haya.Core.pixi.data['back'].sprite.alpha;
                }
            }
        }), 'version')
    }
    // =================================================================================
    // [createOption]
    // =================================================================================
    Scene_Title.prototype.createOption = function() {
        Object.keys($.parameters.title.option.list).map(function(key, index) {
            var _tIndex = index;
            let height = ($.parameters.title.option.space * Object.keys($.parameters.title.option.list).length);
            let y = ((Graphics.boxHeight-(height))/2) + ($.parameters.title.option.space*index);
            Haya.Core.pixi.add(new Text(key, 0, y, function() {
                // style
                this.sprite.style = $.parameters.title.option.normal;
                // mouse
                this.mouse.active = true;
                // over?
                this.mouse.over = function() { 
                    SceneManager._scene.cursor = Haya.Core.get.indexObject($.parameters.title.option.list, this._text);
                }
                // trigger
                this.mouse.trigger.on = function() { SceneManager._scene.moveOut = true; }
                // afterUpdate
                this._afterUpdate = function() {
                    // if is loaded
                    if (Haya.Core.pixi.data['back']._loaded) {
                        // x
                        this.sprite.x = Haya.Core.position.object("center", this.sprite, Haya.Core.pixi.data['back'].sprite).x;
                        if (SceneManager._scene.moveOut) this.sprite.alpha = Haya.Core.pixi.data['back'].sprite.alpha;
                    }
                    // check out
                    if (Haya.Core.get.indexObject($.parameters.title.option.list, this._text) === SceneManager._scene.cursor) {
                        this.sprite.style.fill = $.parameters.title.option.on.fill;
                    } else { this.sprite.style.fill = $.parameters.title.option.off.fill }
                }
            }), index)
        }) 
    }
    // =================================================================================
    // [createCursor]
    // =================================================================================
    Scene_Title.prototype.createCursor = function() {
        Haya.Core.pixi.add(new Picture($.parameters.general.cursor.picture, 0, 0, function() {
            // alpha
            this.sprite.alpha = 0.0;
            // loop of alpha
            this._loopAlpha = new Haya.Core.opacity.loop({min: 0.75});
            // loop of move
            this._loopMove = new Haya.Core.move.loop({});
            // afterUpdate
            this._afterUpdate = function() {
                // alpha
                if (SceneManager._scene.moveOut) {
                    if (Haya.Core.pixi.data['back']._loaded) this.sprite.alpha = Haya.Core.pixi.data['back'].sprite.alpha;
                } else {
                    this.sprite.alpha = this._loopAlpha.value(this.sprite.alpha);
                }
                // what option
                let whatOption = SceneManager._scene.currentOption();
                // y
                this.sprite.y = Haya.Core.position.object("center", this.sprite, whatOption.sprite).y + 2;
                // x
                this.sprite.x = SceneManager._scene.currentOption().sprite.x - 24;
                this.sprite.x += this._loopMove.value();
            }
        }), 'cursor')
    }
    // =================================================================================
    // [currentOption]
    // =================================================================================
    Scene_Title.prototype.currentOption = function () {
        return Haya.Core.pixi.data[SceneManager._scene.cursor]
    }
    // =================================================================================
    // [commandNewGame]
    // =================================================================================
    Scene_Title.prototype.newGame = function() {
        DataManager.setupNewGame();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };
    // =================================================================================
    // [commandContinue]
    // =================================================================================
    Scene_Title.prototype.commandContinue = function() {
        SceneManager.push(Scene_Load);
    };
    // =================================================================================
    // [commandOptions]
    // =================================================================================
    Scene_Title.prototype.commandOptions = function() {
        SceneManager.push(Scene_Options);
    };
    // =================================================================================
    // [playTitleMusic]
    // =================================================================================
    Scene_Title.prototype.playTitleMusic = function() {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    };

    Scene_Title.prototype.isBusy = function() {
        return false;
    };
})(Haya.Scene);

if (Imported.Haya !== undefined) {
    Imported.Haya.Scene = true;
} 
