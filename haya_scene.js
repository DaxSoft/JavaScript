// ================================================================================
// Plug-in    : Haya Scene <> Haya Core
// Author     : Dax Soft | Kvothe
// Website    : www.dax-soft.weebly.com
// Version    : 0.1.0
// ================================================================================

/*:
 * @author Dax Soft | Kvothe
 * 
 * @plugindesc Scene plugin from Haya Pack
 * 
 * @help
 * Important: Need Haya Core
 */

/* ================================================================================
Ctrl+F [locate]:
    :paramaters
    :boot
    :title
================================================================================ */

Haya.Scene = {};

// main
(function ($) {
    'use strict';
    // =============================================================================
    // [Parameters]: :paramaters
    // =============================================================================
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
                    "CREDITS": "",
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
    // =============================================================================
    // [Scene_Boot] :boot
    // =============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()) {
            SceneManager.goto(Scene_Splash);
        } else {
            _Scene_Boot_start.call(this);
        }
    };
    // =============================================================================
    // [Scene_Splash] :splash
    // =============================================================================
    class Scene_Splash extends Scene_Base {
        // create
        create() {
            // variables
            this._pictures = $.parameters.splash.pictures;
            this.index = 0;
            this._speed = $.parameters.splash.speed;
            // super
            super.create();
            // create
            this._pictures.forEach(function(item, index) {
                Haya.img({filename: item, index: index}, function() {
                    this._fade = false; 
                    this.position("center");
                    this.sprite.alpha = 0.0;
                })
            })
        }
        // update
        update() {
            super.update();
            if (Haya.General.Key.anyKeyboard() || TouchInput.isTriggered()) this.endSplash();
            this.fade();
        }
        // fade
        fade() {
            if (Haya.pdata(this.index)._loaded) {
                if (Haya.pdata(this.index)._fade === true) {
                    Haya.pdata(this.index).sprite.alpha -= this._speed;
                    if (Haya.pdata(this.index).sprite.alpha <= 0.0) {
                        this.index++;
                        if (Haya.pdata(this.index) === undefined) this.endSplash();
                    }
                } else {
                    Haya.pdata(this.index).sprite.alpha += this._speed;
                    if (Haya.pdata(this.index).sprite.alpha >= 1.0) {
                        Haya.pdata(this.index)._fade = true;
                    }
                }
            }
        }
        // endSplash
        endSplash() {
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
    }
    // =============================================================================
    // [Scene_Title] :title
    // =============================================================================
    // create
    Scene_Title.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createSprite();
        this.createOption();
        this.createCursor();
        this.cursor = 0;
        this.moveOut = false;
    };
    // =============================================================================
    // [start]
    // =============================================================================
    Scene_Title.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    };

    Scene_Title.prototype.isBusy = function() {
        return false;
    };
    // =============================================================================
    // [update]
    // =============================================================================
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
    // =============================================================================
    // [terminate]
    // =============================================================================
    Scene_Title.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
    };
    // =============================================================================
    // [createBackground]
    // =============================================================================
    Scene_Title.prototype.createBackground = function() {
        Haya.movie({filename: $.parameters.title.movie.filename, index: 'movie'}, function() {
            // auto
            this.auto();
            // volume
            this.sprite.texture.baseTexture.source.volume = $.parameters.title.movie.volume;
            // this.wait
            this.wait = 0;
            // afterUpdate
            this._afterUpdate = function () {
                // loaded
                if (SceneManager._scene.moveOut) {
                    if (this.wait >= 5.0) {
                        eval($.parameters.title.option.list[SceneManager._scene.currentOption()._text])
                    }  else {
                        this.wait += 0.001;
                        this.sprite.alpha -= 0.0005;
                    }
                }
            }
        })
    }
    // =============================================================================
    // [createSprite]
    // =============================================================================
    Scene_Title.prototype.createSprite = function() {
        // back logo
        Haya.img({filename: $.parameters.title.back, index: 'back'}, function () {
            this.sprite.alpha = 0.75;
            this.sprite.x -= 64;
            // after update
            this._afterUpdate = function() {
                // moviment
                if (SceneManager._scene.moveOut === true) {
                    this.sprite.alpha -= 0.05;
                } else {
                    this.sprite.x = Haya.DMath.smooth({id: 'back-forward', target: 96, speed: 3});
                }
            }
        })
        // Logo
        Haya.img({filename: $.parameters.title.logo.picture, index: 'logo'}, function () {
            // moviment
            this.sprite.y = 48
            // afterUpdate
            this._afterUpdate = function() {
                // if is loaded
                if (Haya.Pixi.loaded('back')) {
                    this.sprite.x = Haya.DMath.Position.object({type: "center", a: this.sprite, b: Haya.pdata('back').sprite}).x;
                    if (SceneManager._scene.moveOut) this.sprite.alpha = Haya.pdata('back').sprite.alpha;
                }
            }
        })
        // Version
        Haya.text({text: $.parameters.title.text.version, index: 'version'}, function() {
            // style
            this.sprite.style = $.parameters.title.text.style;
            // y
            this.sprite.y = Graphics.boxHeight - 48;
            // afterUpdate
            this._afterUpdate = function() {
                // if is loaded
                if (Haya.Pixi.loaded('back')) {
                    this.sprite.x = Haya.DMath.Position.object({type: "center", a: this.sprite, b: Haya.pdata('back').sprite}).x;
                    if (SceneManager._scene.moveOut) this.sprite.alpha = Haya.pdata('back').sprite.alpha;
                }
            }
        })
    }
    // =============================================================================
    // [createOption]
    // =============================================================================
    Scene_Title.prototype.createOption = function() {
        Object.keys($.parameters.title.option.list).map(function(key, index) {
            // setup
            let height = ($.parameters.title.option.space * Object.keys($.parameters.title.option.list).length);
            var yText = ((Graphics.boxHeight-(height))/2) + ($.parameters.title.option.space*index);
            // draw
            Haya.text({text: key, index: index}, function () {
                // style
                this.sprite.style = $.parameters.title.option.normal;
                this.sprite.y = yText;
                // mouse
                this.mouse.active = true;
                // over?
                this.mouse.over = function() { 
                    SceneManager._scene.cursor = Haya.General.Get.indexObject($.parameters.title.option.list, this._text);
                }
                // trigger
                this.mouse.trigger.on = function() { SceneManager._scene.moveOut = true; } 
                // afterUpdate
                this._afterUpdate = function() {
                    // if is loaded
                    if (Haya.Pixi.loaded('back')) {
                        this.sprite.x = Haya.DMath.Position.object({type: "center", a: this.sprite, b: Haya.pdata('back').sprite}).x;
                        if (SceneManager._scene.moveOut) this.sprite.alpha = Haya.pdata('back').sprite.alpha;
                    }
                    // check out if is selected
                    if (Haya.General.Get.indexObject($.parameters.title.option.list, this._text) === SceneManager._scene.cursor) {
                        for (let s in $.parameters.title.option.on) {
                            this.sprite.style[s] = $.parameters.title.option.on[s];
                        }
                    } else {
                        for (let s in $.parameters.title.option.off) {
                            this.sprite.style[s] = $.parameters.title.option.off[s];
                        }
                    }
                }
            })
        });
    }
    // =============================================================================
    // [createCursor]
    // =============================================================================
    Scene_Title.prototype.createCursor = function() {
        Haya.img({filename: $.parameters.general.cursor.picture, index: 'cursor'}, function () {
            // alpha
            this.sprite.alpha = 1;
            // after Update
            this._afterUpdate = function() {
                // if is ended
                if (SceneManager._scene.moveOut) {
                    if (Haya.Pixi.loaded('back')) this.sprite.alpha = Haya.pdata('back').sprite.alpha;
                } else {
                    this.sprite.alpha = Haya.DMath.repeat('cursor-opacity', 0.5, 1, 0.02);
                }
                // current option
                let current = SceneManager._scene.currentOption();
                let target = Haya.DMath.Position.object({type: "center", a: this.sprite, b: current.sprite}).y + 2;
                // y
                this.sprite.y = target;
                // x
                this.sprite.x = current.sprite.x - 24;
                this.sprite.x += Haya.DMath.repeat('cursor-move', -5, 5, 0.5);
            }
        })
    }
    // =============================================================================
    // [currentOption]
    // =============================================================================
    Scene_Title.prototype.currentOption = function () {
        return Haya.pdata(SceneManager._scene.cursor);
    }
    // =============================================================================
    // [commandNewGame]
    // =============================================================================
    Scene_Title.prototype.newGame = function() {
        DataManager.setupNewGame();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };
    // =============================================================================
    // [commandContinue]
    // =============================================================================
    Scene_Title.prototype.commandContinue = function() {
        SceneManager.push(Scene_Load);
    };
    // =============================================================================
    // [commandOptions]
    // =============================================================================
    Scene_Title.prototype.commandOptions = function() {
        SceneManager.push(Scene_Options);
    };
})(Haya.Scene);
