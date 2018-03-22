
/**
 * ==============================================================================
 * @file PStore.js | Plugin Store.js
 * @description Feel free to improve this code! 
 * I just ask if you change the code, send me a notification about this.
 * I'll be glad to see your change and if it is very compatible, I'll put
 * on main code! And your name will show up on '@author'
 * Lets improve this plugin and make it better for all.
 * Tip: If you wanna improve some stuffs, watch out the '@todo' list!
 * ==============================================================================
 * @author Dax Soft | Kvothe <www.dax-soft.weebly> / <dax-soft@live.com>
 * @version 0.1.1
 * @requires js/plugins/Haya_Core.js <Haya Core>
 * @license MIT <https://dax-soft.weebly.com/legal.html>
 * ==============================================================================
 * @todo [] Improve the GUI experience
 * @todo [] Check out if already exist the plugin
 * @todo [] Don't require anymore third part to work (Cores)
 * @todo [] Improve the code.
 * ==============================================================================
*/
// ==============================================================================
/**
 * @description Put on here the register link (http link). Don't forget of comma if
 * there is more than one. And on the LAST don't put any comma.
 * @example 
 * var PStore_Register = [
 *      "http link",
 *      "another http link"
 * ]
*/
// ==============================================================================
var PStore_Register = [
    "https://raw.githubusercontent.com/DaxSoft/JavaScript/master/hstore.json"
]
// ==============================================================================
/*:
 * @author Dax Soft | Kvothe
 * 
 * @plugindesc Plugin Store [0.1.0]
 * 
 * @help
 * Important: Insert this after any plugin on PluginManager list.
 * I recommend that you just turn on this plugin when  you desire 
 * to download or check up updates.
 * ======================================================================
 * How create a register file: <link>
 * ======================================================================
 * With this plugin you can download or check if is any update of your 
 * favorite plugins by your favorite authors (of course, for this you need 
 * a register link and... the plugin author has to create one :v).
 * ======================================================================
*/

/* ==============================================================================
Ctrl+F [locate]:
    :pstore                             -> Global 
    :boot                               -> Scene_Boot
    :spstoreregister                    -> Scene_PStoreRegister 
    :spstoreplugin                      -> Scene_PStorePlugin
    :spstore                            -> Scene_PStore 
================================================================================ */
// ==============================================================================
/**
 * @global
 * @var Imported
 * @desc This variable is useful to check up compatibles among several plugins.
*/
var Imported = Imported || {};
// ==============================================================================
/**
 * @global
 * @var PStore
 * @desc global variable of this plugin '$ -> PStore' to be used on another 
 * plugin. Then, functions that have '$' can be accessed by using 'PStore'
*/
var PStore = PStore || {};
// ==============================================================================
(function ($) {
'use strict';
    // ==========================================================================
    /**
     * @global PStore :pstore
     * @var $ 
     * @desc General stuffs that can be accessed by other plugins.
     */
    $ = $ || {};
    // ==========================================================================
    /**
     * @constant fs
     * @description import File System methods from Node.FileSystem
     */
    const fs = require('fs');
    // ==========================================================================
    /**
     * @function Register
     * @description take care of register stuffs
     */
    $.Register = function() { throw new Error('This is a static class'); };
    /**
     * @var $.Register.data
     * @description get all data store to display
     * @var $.Register._load
     * @description used to save the register file
     * @var $.Register.picture
     * @description used to save url pictures from each Store. Then, don't will download if already exist
     * @var $.Register._psType
     * @description manager the type of download that will be done on Scene_PStoreDownload
     * @var $.Register.plugin
     * @description used to display all plugins of the chosen Store. Scene_PStorePlugin.
     * @var $.Register.current
     * @description store the current plugin chosen to download
     * @var $.Register._dplugin
     * @description manager what type of download will be. Download or Update.
     */
    $.Register.data = [];
    $.Register._load = null;
    $.Register.picture = {};
    $.Register._psType = "register";
    $.Register.plugin = {};
    $.Register.current = null;
    $.Register._dplugin = "";
    /**
     * @function lpstore
     * @memberof Register
     * @description create a general json file for the Store. Contains:
     * cache url and keep version.
     * @type {json}
     */
    $.Register.lpstore = function() {
        // make sure that folder exist
        Haya.FileIO.mkdir("pstore");
        let local = Haya.FileIO.local("pstore") + "/" + "pstore.json";
        // get general json file if exist
        if (fs.existsSync(local)) {
            // get json
            $.Register._load = Haya.FileIO.json(local);
        } else {
            // don't get json
            $.Register._load = {};
        }
    }
    /**
     * @function lregister
     * @desc load all store from 'pstore'
     * @type {json}
     */
    $.Register.lregister = function() {
        // clean up data
        $.Register.data.length = 0;
        // make sure that folder exist
        Haya.FileIO.mkdir("pstore");
        // each file
        Haya.FileIO.list("pstore/", function (filename) {
            // replace filename
            let _filename = filename.replace(/^.*[\\\/]/, '');
            // load just '.json' file
            if (_filename.match(/\.json$/gi)) {
                if (!(_filename.match(/pstore/i))) {
                    let ljson = Haya.FileIO.json(filename);
                    $.Register.data.push(ljson);
                }
            } else if (_filename.match(/.(jpg|png)$/i)) {
                $.Register.picture[String(_filename.split('.')[0])] = filename;
            }
        }) // end object
        Haya.Pixi.Manager.load($.Register.picture);
    }
    /**
     * @function pstore
     * @description keep cache of url 'picture and background'
     * @type {json}
     */
    $.Register.pstore = function() {
        // make sure that folder exist
        Haya.FileIO.mkdir("pstore");
        $.Register._load =  $.Register._load || {};
        // sets
        $.Register._load.picture = $.Register._load.picture || [];
        // data
        $.Register.data.forEach(function (element) {
            // pictures
            if (element.hasOwnProperty("general")) {
                if (element.general.hasOwnProperty("picture")) {
                    if ($.Register._load.picture.indexOf(element.general.picture) === -1) {
                        $.Register._load.picture.push(element.general.picture);
                    }
                }
                if (element.general.hasOwnProperty("background")) {
                    if ($.Register._load.picture.indexOf(element.general.background) === -1) {
                        $.Register._load.picture.push(element.general.background);
                    }
                }
            }
        })
        // local
        let local = Haya.FileIO.local("pstore") + "/" + "pstore.json";
        // create file
        fs.writeFile(local, JSON.stringify($.Register._load));
    }
    /**
     * @function vpstore
     * @description save the current version from plugin that 
     * was downloaded
     * @type {json}
     */
    $.Register.vpstore = function() {
        // make sure that folder exist
        Haya.FileIO.mkdir("pstore");
        $.Register._load =  $.Register._load || {};
        // sets
        $.Register._load.version = $.Register._load.version || {};
        let version = $.Register.current.plugin.version.replace(/(\.|\,)/, '');
        version = parseFloat(version);
        $.Register._load.version[$.Register.current.plugin.name] = version;
        // local
        let local = Haya.FileIO.local("pstore") + "/" + "pstore.json";
        // create file
        fs.writeFile(local, JSON.stringify($.Register._load));
    }
    /**
     * @function cpicture 
     * @description check out the cache of url. {picture and background}
    */
   $.Register.cpicture = function (url) {
       if (Haya.Utils.invalid($.Register._load)) return false;
       if (!(Haya.Utils.isObject($.Register._load))) return false;
       if (!($.Register._load.hasOwnProperty("picture"))) return false;
       if ($.Register._load.picture.indexOf(url) !== -1) return true;
       return false;
   }
   /**
    * @function ctypeDownload
    * @description check out the type of download. If has already the plugin, check if
    * is for update or not. Or don't do nothing
    */
    $.Register.ctypeDownload = function (plugin) {
        // version
        if (Haya.Utils.invalid($.Register._load.version)) {
            $.Register._dplugin = "download";
        } else {
            if ($.Register._load.version.hasOwnProperty(plugin.name)) {
                // version
                let version = plugin.version.replace(/(\.|\,)/, '');
                version = parseFloat(version);
                //m ore
                if (version > $.Register._load.version[plugin.name]) {
                    $.Register._dplugin = "update";
                } else {
                    $.Register._dplugin = "none"
                }
            } else {
                $.Register._dplugin = "download";
            }
        }
        console.log($.Register._dplugin)
    }
    // ==========================================================================
    /**
     * @class Scene_Boot :boot
     * @memberof Scene_Base
     * @classdesc Before any scene, this!
    */

    /**
     * @alias Scene_Boot.prototype.start
     * @description start of scene
    */
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()) {
            SceneManager.goto(Scene_PStoreDownload);
        } else {
            _Scene_Boot_start.call(this);
        }
    };
    // ==========================================================================
    /**
     * @class Scene_PStoreRegister :spstoreregister
     * @memberof Scene_Base
     * @classdesc Get register file to Plugin Store
     */
    class Scene_PStoreDownload extends Scene_Base {
        /**
         * @constructor
         */
        constructor() {
            super.constructor.call(this)
            this._time = 500;
            $.Register.lpstore();
        }
        /**
         * @function initialize
         * @desc setup of initial variables
         */
        initialize() {
            super.initialize.call(this);
            // type of download
            if ($.Register._psType === "register") {
                setTimeout(this.rdownload, 1000);
            } else if ($.Register._psType === "update") {
                setTimeout(this.pdownload, 1000);
            } else if ($.Register._psType === "download") {
                setTimeout(this.pdownload, 1000);
            }
        } 
        /**
         * @function rdownload
         * @description download register plugin store
         */
        rdownload() {
            var psRegister = [];
            var index = PStore_Register.length;
            while (index--) {
                // onLoad
                let onLoad;
                if (index === 0) {
                    onLoad = function () {
                        setTimeout(function () {
                            $.Register.lregister();
                            SceneManager._scene.idownload();
                        }, 1000)
                    }
                }
                // download
                Haya.FileIO.Download.txt(
                    PStore_Register[index],
                    "pstore",
                    undefined,
                    onLoad
                )
            }
        }
        /**
         * @function idownload
         * @description download some imgs
         */
        idownload() {
            // get what will download
            var idata = {};
            var i = $.Register.data.length;
            while (i--) {
                let item = $.Register.data[i];
                idata[item.general.author] = idata[item.general.author] || [];
                // check out
                if (item.general.hasOwnProperty("picture")) {
                    // download general.picture
                    if (($.Register.cpicture(item.general.picture)) === false) {
                        idata[item.general.author].push([item, "picture"]);
                    }
                }
                // check out
                if (item.general.hasOwnProperty("background")) {
                    // download general.background
                    if (($.Register.cpicture(item.general.background)) === false) {
                        idata[item.general.author].push([item, "background"]);
                    }
                }
            }
            // abort
            var abort = true;
            // each
            Object.keys(idata).map(function (key) {
                if (Object.keys(idata[key]).length !== 0) {
                    abort = false;
                }   
            })
            // abort
            if (abort === true) {
                $.Register.pstore();
                setTimeout(function () {
                    SceneManager.goto(Scene_PStore);
                }, 500)
            }
            // download
            Object.keys(idata).map(function (keyname, index) {
                // on load
                var onLoad;
                // array
                idata[keyname].forEach(function (element, n) {
                    // last
                    if (n === idata[keyname].length-1 && index === Object.keys(idata).length - 1) {
                        onLoad = function () {
                            $.Register.pstore();
                            setTimeout(function () {
                                SceneManager.goto(Scene_PStore);
                            }, 500)
                        }
                    }
                    // picture
                    if (element[1] === "picture") {
                        Haya.FileIO.Download.img(
                            element[0].general.picture,
                            "pstore",
                            element[0].general.author,
                            "",
                            onLoad
                        )
                    } else if (element[1] === "background") {
                        Haya.FileIO.Download.img(
                            element[0].general.background,
                            "pstore",
                            element[0].general.author + "_background",
                            "",
                            onLoad
                        )
                    }
                })
            })
        }
        /**
         * @function pdownload
         * @description download plugin
         */
        pdownload() {
            // check out
            if (Haya.Utils.invalid($.Register.current)) {
                SceneManager.goto(Scene_PStorePlugin);
            }
            // download script
            if ($.Register.current.hasOwnProperty("js")) {
                // is is zero
                if ($.Register.current.js.length === 0) {
                    this.pdownloadIMG();
                }
                // script
                $.Register.current.js.forEach(function (element, index) {
                    // on Load
                    let onLoad;
                    // if is last
                    if (index === $.Register.current.js.length - 1) {
                        onLoad = function () {
                            setTimeout(function () {
                                SceneManager._scene.pdownloadIMG();
                            }, 500)
                        }
                    }
                    // filename
                    element.filename = element.filename || element.url.split('/').pop();
                    // folder
                    element.folder = element.folder || "js/plugins";
                    // cache
                    element.cache = element.cache || false;
                    // if element is not cached
                    if (element.cache === false) {
                        // if need to be confirmed
                        element.confirm = element.confirm || false;
                        // need?
                        if (element.confirm === true) {
                            if (window.confirm("Do you wanna download this file?\n" + element.filename)) {
                                Haya.FileIO.Download.txt(
                                    element.url,
                                    element.folder,
                                    element.filename,
                                    onLoad
                                )
                            }
                        } else {
                            Haya.FileIO.Download.txt(
                                element.url,
                                element.folder,
                                element.filename,
                                onLoad
                            )
                        }
                    } else {
                        if (index === $.Register.current.js.length - 1) {
                            if (Haya.Utils.isFunction(onLoad)) {
                                onLoad.call(this);
                            }
                        }
                    }
                })
            } else {
                this.pdownloadIMG();
            }
            // update version
            //$.Register.vpstore();
        }
        /**
         * @function pdownloadIMG
         * @description download imgs of plugin if there is
         */
        pdownloadIMG() {
            // download img
            if ($.Register.current.hasOwnProperty("img")) {
                // is is zero
                if ($.Register.current.img.length === 0) {
                    this.pdownloadAUDIO();
                }
                // script
                $.Register.current.img.forEach(function (element, index) {
                    // on Load
                    let onLoad;
                    // if is last
                    if (index === $.Register.current.img.length - 1) {
                        onLoad = function () {
                            setTimeout(function () {
                                SceneManager._scene.pdownloadAUDIO();
                            }, 500)
                        }
                    }
                    // filename
                    element.filename = element.filename || element.url.split('/').pop();
                    // folder
                    element.folder = element.folder || "img";
                    // cache
                    element.cache = element.cache || false;
                    // type of img
                    element.type = element.type || "";
                    // if element is not cached
                    if (element.cache === false) {
                        // if need to be confirmed
                        element.confirm = element.confirm || false;
                        // need?
                        if (element.confirm === true) {
                            if (window.confirm("Do you wanna download this file?\n" + element.filename)) {
                                Haya.FileIO.Download.img(
                                    element.url,
                                    element.folder,
                                    element.filename,
                                    element.type,
                                    onLoad
                                )
                            }
                        } else {
                            Haya.FileIO.Download.img(
                                element.url,
                                element.folder,
                                element.filename,
                                element.type,
                                onLoad
                            )
                        }
                    } else {
                        if (index === $.Register.current.img.length - 1) {
                            if (Haya.Utils.isFunction(onLoad)) {
                                onLoad.call(this);
                            }
                        }
                    }
                })
            } else {
                this.pdownloadAUDIO();
            }
        }
        /**
         * @function pdownloadAUDIO
         * @description download audio if there is
         */
        pdownloadAUDIO() {
            this.pback();
        }
        /**
         * @function pback
         * @description back to plugin store
         */
        pback() {
            $.Register.vpstore();
            setTimeout(function () {
                SceneManager.goto(Scene_PStorePlugin);
            }, 500)
        }
        /**
         * @function create
         * @desc create objects on start
         */
        create() {
            super.create.call(this);
            this.text = Haya.Text("Please wait :)\n", {}, function () {
                // style
                this.sprite.style = {
                    dropShadow: true,
                    dropShadowAlpha: 0.4,
                    dropShadowAngle: 0,
                    dropShadowBlur: 5,
                    dropShadowDistance: 2,
                    fill: "#eee",
                    fontFamily: "Helvetica",
                    fontSize: 14,
                    strokeThickness: 2
                }
                this.sprite.alpha = 0.0;
                // update
                this._update = function () {
                    // position
                    this.position("center");
                    // if
                    if (~~this.sprite.alpha <= 1) this.sprite.alpha += 0.1;
                }
            })
        }
        /**
         * @function terminate
         * @desc dispose the scene
         */
        terminate() {
            super.terminate.call(this);
            this.text.dispose();
        }
        /**
         * @function update
         * @desc update the scene
         */
        update() {
            super.update.call(this);
            this.text.update();
        }
    } 
    // ==========================================================================
    /**
     * @class Scene_PStore :spstore
     * @memberof Scene_Base
     * @classdesc Main scene of Plugin Store
     */
    class Scene_PStore extends Scene_Base {
        /**
         * @constructor
         */
        constructor() {
            super.constructor.call(this);
            this.index = 0;
            this.button = [];
        }
        /**
         * @function initialize
         * @desc setup of initial variables
         */
        initialize() {
            super.initialize.call(this);
        } 
        /**
         * @function create
         * @desc create objects on start
         */
        create() {
            super.create.call(this);
            // title
            let text = "Plugin Store (%1)".format($.Register.data.length.padZero(2)).toUpperCase();
            this.title = Haya.Text(
                text,
                {},
                function () {
                    // style
                    this.sprite.style = {
                        dropShadow: true,
                        dropShadowAlpha: 0.4,
                        dropShadowAngle: 0,
                        dropShadowBlur: 5,
                        dropShadowDistance: 2,
                        fill: "#eee",
                        fontFamily: "Helvetica",
                        fontSize: 12,
                        strokeThickness: 2
                    }
                    // position
                    this.sprite.x = 16;
                    this.sprite.y = 16;  
                }
            ) 
            // create button store
            this.bstore();
        }
        /**
         * @function bstore
         * @description draw the button store
         */
        bstore() {
            // delete if exist
            var i = this.button.length;
            while (i--) {
                this.button[i].dispose();
            }
            // create
            for (var i = this.index; i < $.Register.data.length; i++) {
                this.button[i] = new Haya.SpriteObject({
                    type: 'graphic',
                    register: $.Register.data[i],
                    graphic: {
                        bfill: 0x2d3436,
                        type: 'rect',
                        width: Graphics.width,
                        height: 64
                    },
                    index: i
                }, function () {
                    // position
                    this.sprite.y = ((72 * this.hash.index)) + 48;
                    // display picture
                    this.picture = new Haya.Picture(
                        Haya.Pixi.Manager.cache(this.hash.register.general.author),
                        {stage: this.sprite},
                        function () {
                            // size
                            this.sprite.height = this.sprite.height >= 60 ? 60 : this.sprite.height;
                            this.sprite.width  = this.sprite.width >= 60 ? 60 : this.sprite.width;
                            // position
                            this.sprite.x = (60 - this.sprite.width) / 2;
                            this.sprite.y = (this.hash.stage.height - this.sprite.height) / 2;
                        }
                    )
                    // display store
                    let tstore = String("Store from:\t" + this.hash.register.general.author)
                    this.store = new Haya.Text(
                        tstore.toUpperCase(), 
                        {stage: this.sprite},
                        function () {
                            // style
                            this.sprite.style = {
                                fill: "#eee",
                                fontFamily: "Helvetica",
                                fontSize: 10,
                                strokeThickness: 1
                            }
                            // position
                            this.sprite.x = 64;
                            this.sprite.y = 4;
                        }
                    )
                    // display quantity
                    let tplugin = String("(%1)".format(this.hash.register.plugin.length));
                    this.quantity = new Haya.Text(tplugin, {stage: this.sprite},
                        function () {
                        //#fdcb6e
                        // style
                        this.sprite.style = {
                            fill: "#fdcb6e",
                            fontFamily: "Helvetica",
                            fontSize: 10,
                            strokeThickness: 1
                        }
                        // position
                        this.sprite.x = this.hash.stage.width - 24;
                        this.sprite.y = 4;
                    })
                    this.tdesc = "";
                    // description
                    if (Haya.Utils.isArray(this.hash.register.general.description)) {
                        var idesc = this.hash.register.general.description.length;
                        while (idesc--) {
                            this.tdesc += this.hash.register.general.description[idesc] + "\n";
                        }
                    } else {
                        this.tdesc = String(this.hash.register.general.description);
                    }
                    this.description = new Haya.Text(
                        this.tdesc, {stage: this.sprite},
                        function () {
                            // style
                            this.sprite.style = {
                                fill: "#eee",
                                fontFamily: "Helvetica",
                                fontSize: 10,
                                strokeThickness: 1
                            }
                            // position
                            this.sprite.x = 64;
                            this.sprite.y = 20;
                        }
                    )
                    // mouse setup
                    this.mouse.active = true;
                    // mouse on
                    this.mouse.over = function () {
                        this.sprite.alpha = 1;
                    }
                    // mouse off
                    this.mouse.out = function () {
                        this.sprite.alpha = 0.5;
                    }
                    // trigger on
                    this.mouse.trigger.on = function () {
                        $.Register.plugin = this.hash.register;
                        SceneManager.goto(Scene_PStorePlugin);
                    }
                    // update
                    this._update = function () {
                        
                    }
                })
            }
        }
        /**
         * @function terminate
         * @desc dispose the scene
         */
        terminate() {
            super.terminate.call(this);
            this.title.dispose();
            var i = this.button.length;
            while (i--) {
                this.button[i].dispose();
            }
        }
        /**
         * @function update
         * @desc update the scene
         */
        update() {
            super.update.call(this);
            this.button.forEach(function (element) {
                element.update();
            })
        }
    }
    // ==========================================================================
    /**
     * @class Scene_PStorePlugin :spstoreplugin
     * @memberof Scene_Base
     * @classdesc Page to download plugin from author register
     */
    class Scene_PStorePlugin extends Scene_Base {
        /**
         * @constructor
         */
        constructor() {
            super.constructor.call(this)
            $.Register.current = null;
            this.index = 0;
            this.cursor = null;
            this.button = [];
        }
        /**
         * @function initialize
         * @desc setup of initial variables
         */
        initialize() {
            super.initialize.call(this);
        } 
        /**
         * @function create
         * @desc create objects on start
         */
        create() {
            super.create.call(this);
            // create background
            this.background = Haya.Picture(
                Haya.Pixi.Manager.cache($.Register.plugin.general.author + "_background"),
                {},
                function () {
                    this.sprite.width = Graphics.width;
                    this.sprite.height = Graphics.height;
                    this.update();
                }
            )
            // title
            let text = String("Store from:\t" + $.Register.plugin.general.author).toUpperCase();
            this.title = Haya.Text(
                text,
                {},
                function () {
                    // style
                    this.sprite.style = {
                        dropShadow: true,
                        dropShadowAlpha: 0.4,
                        dropShadowAngle: 0,
                        dropShadowBlur: 5,
                        dropShadowDistance: 2,
                        fill: "#eee",
                        fontFamily: "Helvetica",
                        fontSize: 12,
                        strokeThickness: 2
                    }
                    // position
                    this.sprite.x = 16;
                    this.sprite.y = 16;  
                }
            ) 
            // create button plugin store
            this.bplugin();
            // create info plugin page
            this.iplugin();
            // create get button
            this.buttonGet();
        }
        /**
         * @function bplugin
         * @description create plugin button
         */
        bplugin() {
            // delete if exist
            var i = this.button.length;
            while (i--) {
                this.button[i].dispose();
            }
            // create button
            for (var i = this.index; i < ($.Register.plugin.plugin.length); i++) {
                this.button[i] = new Haya.SpriteObject({
                    type: 'graphic',
                    register: $.Register.plugin.plugin[i],
                    graphic: {
                        bfill: 0x2d3436,
                        type: 'rect',
                        width: Graphics.width,
                        height: 64
                    },
                    index: i
                }, function () {
                    // position
                    this.sprite.y = ((72 * this.hash.index)) + 48;
                    // display picture
                    this.picture = new Haya.Picture(
                        Haya.Pixi.Manager.cache($.Register.plugin.general.author),
                        {stage: this.sprite},
                        function () {
                            // size
                            this.sprite.height = this.sprite.height >= 60 ? 60 : this.sprite.height;
                            this.sprite.width  = this.sprite.width >= 60 ? 60 : this.sprite.width;
                            // position
                            this.sprite.x = (60 - this.sprite.width) / 2;
                            this.sprite.y = (this.hash.stage.height - this.sprite.height) / 2;
                        }
                    )
                    // display plugin name
                    this.name = Haya.Text(
                        String(this.hash.register.name).toUpperCase(),
                        {stage: this.sprite},
                        function () {
                            // style
                            this.sprite.style = {
                                fill: "#eee",
                                fontFamily: "Helvetica",
                                fontSize: 10,
                                strokeThickness: 1
                            }
                            // position
                            this.sprite.x = 64;
                            this.sprite.y = 4;
                        }
                    )
                    // display version
                    this.version = Haya.Text(
                        String(this.hash.register.version),
                        {stage: this.sprite},
                        function () {
                            // style
                            this.sprite.style = {
                                fill: "#fdcb6e",
                                fontFamily: "Helvetica",
                                fontSize: 10,
                                strokeThickness: 1
                            }
                            // position
                            this.sprite.x = this.hash.stage.width - 32;
                            this.sprite.y = 4;
                        }
                    )
                    // display description
                    this.tdesc = "";
                    // description
                    if (Haya.Utils.isArray(this.hash.register.description)) {
                        this.hash.register.description.forEach(function (desc) {
                            this.tdesc += desc + "\n";
                        }.bind(this))
                    } else {
                        this.tdesc = String(this.hash.register.description);
                    }
                    this.description = Haya.Text(
                        this.tdesc,
                        {stage: this.sprite},
                        function () {
                            // style
                            this.sprite.style = {
                                fill: "#eee",
                                fontFamily: "Helvetica",
                                fontSize: 10,
                                strokeThickness: 1
                            }
                            // position
                            this.sprite.x = 64;
                            this.sprite.y = 20;
                        }
                    )
                    // mouse
                    this.mouse.active = true;
                    // over
                    this.mouse.over = function () {
                        this.sprite.alpha = 1;
                    }
                    // out
                    this.mouse.out = function () {
                        this.sprite.alpha = 0.5;
                    }
                    // trigger-on
                    this.mouse.trigger.on = function () {
                        if ($.Register.current === null) {
                            SceneManager._scene.cursor = this.hash.index;
                            $.Register.current = this.hash.register;
                            $.Register.ctypeDownload(this.hash.register);
                        }
                    }
                }) // end
            }
        }
        /**
         * @function iplugin
         * @description create info plugin page. To download and stuffs like this
         */
        iplugin() {
            this.info = new Haya.SpriteObject({
                type: 'graphic',
                graphic: {
                    type: 'rect',
                    bfill: 0x2d3436,
                    width: 256,
                    height: Graphics.height 
                }
            }, function() {
                // requeriment title
                this.requeriment = Haya.Text(
                    "requeriment".toUpperCase(),
                    {stage: this.sprite},
                    function () {
                        // style
                        this.sprite.style = {
                            fill: "#dfe6e9",
                            fontFamily: "Helvetica",
                            fontStyle: 'italic',
                            fontSize: 12,
                            cacheAsBitmap: true
                        }
                        // position
                        this.sprite.x = 4;
                        this.sprite.y = 8;
                    }
                ) 
                // requeriment list
                this.rlist = Haya.Text(
                    "",
                    {stage: this.sprite},
                    function () {
                        // stlye
                        this.sprite.style = {
                            fill: "#eee",
                            fontFamily: "Helvetica",
                            fontSize: 10,
                            breakWord: true,
                            wordWrapWidth: ~~(96),
                            wordWrap: true
                        }
                        // position
                        this.sprite.x = 6;
                        this.sprite.y = 32;
                        // old text
                        this._text = "";
                        // update
                        this._update = function () {
                            if (this.sprite.visible) {
                                // has to be
                                if (!(Haya.Utils.invalid($.Register.current.requeriment))) {
                                    console.log(Haya.Utils.isArray($.Register.current.requeriment))
                                    // if is array
                                    if (Haya.Utils.isArray($.Register.current.requeriment)) {
                                        // has more than zero
                                        if ($.Register.current.requeriment.length > 0) {
                                            this._text = $.Register.current.requeriment.join("\n");
                                        } else {
                                            this._text = "None"
                                        }
                                    }
                                } 
                                if (this.sprite.text !== this._text) {
                                    this.sprite.text = this._text;
                                }
                            }
                        }
                    }
                )
                // incompatible title
                this.incompatible = Haya.Text(
                    "incompatible".toUpperCase(),
                    {stage: this.sprite},
                    function () {
                        // style
                        this.sprite.style = {
                            fill: "#dfe6e9",
                            fontFamily: "Helvetica",
                            fontStyle: 'italic',
                            fontSize: 12,
                            cacheAsBitmap: true
                        }
                        // position
                        this.sprite.x = 162;
                        this.sprite.y = 8;
                    }
                ) 
                // incompatible list
                this.ilist = Haya.Text(
                    "",
                    {stage: this.sprite},
                    function () {
                        // stlye
                        this.sprite.style = {
                            fill: "#eee",
                            fontFamily: "Helvetica",
                            fontSize: 10,
                            breakWord: true,
                            wordWrapWidth: ~~(96),
                            wordWrap: true
                        }
                        // position
                        this.sprite.x = 166;
                        this.sprite.y = 32;
                        // old text
                        this._text = "";
                        // update
                        this._update = function () {
                            if (this.sprite.visible) {
                                // has to be
                                if ($.Register.current.hasOwnProperty("incompatible")) {
                                    // if is array
                                    if (Haya.Utils.isArray($.Register.current.incompatible)) {
                                        // has more than zero
                                        if ($.Register.current.incompatible.length > 0) {
                                            this._text = $.Register.current.incompatible.join("\n");
                                        } else {
                                            this._text = "None"
                                        }
                                    }
                                } 
                                if (this.sprite.text !== this._text) {
                                    this.sprite.text = this._text;
                                }
                            }
                        }
                    }
                )
                // position
                this.sprite.x = Graphics.width - (this.sprite.width+5);
                // update
                this._update = function () {
                    // visible
                    this.sprite.visible = $.Register.current !== null;
                    // true
                    if (this.sprite.visible) {
                        this.rlist.update();
                        this.ilist.update();
                        // cancel
                        if (TouchInput.isCancelled()) {
                            $.Register.current = null;
                            SceneManager._scene.cursor = null;
                            return;
                        }
                        this.sprite.alpha = this.sprite.align <= 1.0 ? this.sprite.alpha + 0.1 : 1;
                    } else {
                        this.sprite.alpha = 0;
                    }
                }
            })
        }
        /**
         * @function bget
         * @description button to download or update
         */
        buttonGet() {
            this.bget = new Haya.SpriteObject({
                type: 'graphic',
                graphic: {
                    type: 'rect',
                    bfill: 0x636e72,
                    width: 256,
                    height: 32
                },
            }, function () {
                // position
                this.sprite.x = SceneManager._scene.info.sprite.x;
                this.sprite.y = (  SceneManager._scene.info.sprite.height - 64);
                // visible
                this.sprite.visible =  SceneManager._scene.info.sprite.visible;
                // mouse
                this.mouse.active = true;
                this.mouse.over = function () {
                    this.sprite.alpha = 1;
                } 
                this.mouse.out = function () {
                    this.sprite.alpha = 0.5;
                }
                this.mouse.trigger.on = function () {
                    // type
                    if ($.Register._dplugin === "update") {
                        $.Register._psType = "update";
                        SceneManager.goto(Scene_PStoreDownload);
                    } else if ($.Register._dplugin === "download") {
                        $.Register._psType = "download";
                        SceneManager.goto(Scene_PStoreDownload);
                    } 
                }
                // text
                this.text = Haya.Text("", {stage: this.sprite}, function () {
                    // style
                    this.sprite.style = {
                        fill: "#eee",
                        fontFamily: "Helvetica",
                        fontSize: 14
                    }
                    // update
                    this._update = function () {
                        this.sprite.x = (this.hash.stage.width - this.sprite.width) / 2;
                        this.sprite.y = (this.hash.stage.height - this.sprite.height) / 2;
                        // type
                        if ($.Register._dplugin === "update") {
                            this.sprite.text = "UPDATE";
                        } else if ($.Register._dplugin === "download") {
                            this.sprite.text = "DOWNLOAD";
                        } else {
                            this.sprite.text = "NOTHING";
                        }
                    }
                })
                // update
                this._update = function () {
                    // visible
                    this.sprite.visible =  SceneManager._scene.info.sprite.visible;
                    // type
                    if (this.sprite.visible) {
                        this.text.update();
                    }
                }
            })
        }
        /**
         * @function terminate
         * @desc dispose the scene
         */
        terminate() {
            super.terminate.call(this);
            this.title.dispose();
            this.info.dispose();
            this.bget.dispose();
            this.background.dispose();
            this.button.forEach(function (element) {
                element.dispose();
            }.bind(this))
        }
        /**
         * @function update
         * @desc update the scene
         */
        update() {
            super.update.call(this);
            // return
            if ($.Register.current === null) {
                // cancel
                if (TouchInput.isCancelled()) {
                    SceneManager.goto(Scene_PStore);
                    return;
                }
            }
            this.info.update();
            this.bget.update();
            this.button.forEach(function (element, index) {
                element.update();
                // cursor
                if (!(Haya.Utils.invalid(this.cursor))) {
                    if (index === this.cursor) {
                        element.sprite.alpha = 1;
                    }
                }
            }.bind(this))
        }
    }
    // ============================================================================
})(PStore);
Imported["PStore"] = true; 
