
/**
 * @file Ulse | Ultimate Sensor Event
 * @author Dax Soft | Kvothe <www.dax-soft.weebly> / <dax-soft@live.com>
 * @version 1.6.0
 * @license https://dax-soft.weebly.com/legal.html
 */

/*:
 * @author Dax Soft  | Kvothe
 * 
 * @plugindesc Ultimate Sensor Event [1.6.0]
 * 
 * @help
 * System of sensor. Used to make the npc detect your presence — of the player.
 * Very useful to stealth games: In which the player must keep your presence hidden,
 * to continue.
 * Support sensor between events.
 * Check out the tutorial at http://tutorial-dax.weebly.com/ulse.html
 * ===========================================================================
*/

/**
 * @var Imported
 * @desc valid import 
 */
Imported = Imported || {};

/**
 * @var Ulse
 * @desc global variable of script
 */
var Ulse = Ulse || {}
Ulse.version = 1.6;

(function ($) {
'use strict';
    // ============================================================================
    /**
     * :gameCharacter
     * @class Game_Character
     * @classdesc addons toward this class
     * @memberof Game_CharacterBase
     */

    /**
     * @desc check out if the target of sensor is valid
     * @param {Game_Character} target
     * @returns {boolean}
     */
    Game_Character.prototype.sensorTargetValid = function(target) {
        if (target === undefined || target === null) return false;
        if (!(target instanceof Game_Character)) return false;
        return true;
    }

    /**
     * @desc Check out by square area
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean}
     */
    Game_Character.prototype.sensorArea = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // return
        return ( (Math.abs(target._x - this._x) + Math.abs(target._y - this._y)) <= Math.abs(range) );
    }

    /**
     * @description Check out if the targe is on (above)
     * @param {Game_Character} target
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorOn = function(target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // return
        return ( this.pos(target.x, target.y) );
    }

    /**
     * @desc Sensor by a right line. ​Static line: would fix independent of 
     * the direction that the event is.
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean}
     */
    Game_Character.prototype.sensorRight = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        if (target._y === this._y) {
            for (let x = this._x; x < (this._x + Math.floor(range)); x++) {
                if (!(this.isMapPassable(x, this._y, 6))) break;
                if (target._x === x) _switch = true;
            }
        }
        // return
        return _switch;
    }

    /**
     * @desc Sensor by a left line. ​Static line: would fix independent of 
     * the direction that the event is.
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean}
     */
    Game_Character.prototype.sensorLeft = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        if (target._y === this._y) {
            for (let x = this._x; x > (this._x - Math.floor(range)); x--) {
                if (!(this.isMapPassable(x, this._y, 4))) break;
                if (target._x === x) _switch = true;
            }
        }
        // return
        return _switch;
    }

    /**
     * @desc Sensor by a front line. ​Static line: would fix independent of 
     * the direction that the event is.
     * @param {number} range 
     * @param {Game_Character} target
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorFront = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        if (target._x === this._x) {
            for (let y = this._y; y < (this._x + Math.floor(range)); y++) {
                if (!(this.isMapPassable(this._x, y, 2))) break;
                if (target._y === y) _switch = true;
            }
        }
        // return
        return _switch;
    }

    /**
     * @description Sensor by a back line. ​Static line: would fix independent of 
     * the direction that the event is.
     * @param {number} range 
     * @param {Game_Character} target 
     */
    Game_Character.prototype.sensorAgo = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        if (target._x === this._x) {
            for (let y = this._y; y > (this._y - Math.floor(range)); y--) {
                if (!(this.isMapPassable(this._x, y, 8))) break;
                if (target._y === y) _switch = true;
            }
        }
        // return
        return _switch;
    }

    /**
     * @description Sensor as cross form (+ symbol). ​Static line:
     * would fix independent of the direction that the event is.
     * @param {number} range 
     * @param {Game_Character} target
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorCross = function(range, target) {
        // return if any is true
        return (
            this.sensorAgo(range, target)   || 
            this.sensorFront(range, target) ||
            this.sensorLeft(range, target)  ||
            this.sensorRight(range, target)
        );
    }

    /**
     * @description Sensor just on vision of the event.  In straight line
     * @param {number} range 
     * @param {Game_Character} target
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorVision = function(range, target) {
        switch (this.direction()) {
            case 2: return (this.sensorFront(range, target));
            case 4: return (this.sensorLeft(range, target));
            case 6: return (this.sensorRight(range, target));
            case 8: return (this.sensorAgo(range, target));
            default: break;
        }
    }

    /**
     * @desc Sensor just on behind of the event (watch your backs). In straight line
     * @param {number} range 
     * @param {Game_Character} target
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorBack = function(range, target) {
        switch (this.direction()) {
            case 8: return (this.sensorFront(range, target));
            case 6: return (this.sensorLeft(range, target));
            case 4: return (this.sensorRight(range, target));
            case 2: return (this.sensorAgo(range, target));
            default: break;
        }
    }

    /**
     * @description Sensor just on left of the event.  In straight line
     * @param {number} range 
     * @param {Game_Character} target
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorLeftArm = function(range, target) {
        switch (this.direction()) {
            case 4: return (this.sensorFront(range, target));
            case 8: return (this.sensorLeft(range, target));
            case 2: return (this.sensorRight(range, target));
            case 6: return (this.sensorAgo(range, target));
            default: break;
        }
    }

    /**
     * @desc Sensor just on right of the event.  In straight line
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorRightArm = function(range, target) {
        switch (this.direction()) {
            case 4: return (this.sensorFront(range, target));
            case 2: return (this.sensorLeft(range, target));
            case 8: return (this.sensorRight(range, target));
            case 6: return (this.sensorAgo(range, target));
            default: break;
        }
    }

    /**
     * @desc Sensor ​on the top-left. Diagonal
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorTopLeft = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        for (let i = 0; i < Math.floor(range) + 1; i++) {
            if ( (target._x === (this._x - i)) && (target._y === (this._y - i)) ) _switch = true;
        }
        // return
        return _switch;
    }

    /**
     * @desc Sensor ​on the top-right. Diagonal
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorTopRight = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        for (let i = 0; i < Math.floor(range) + 1; i++) {
            if ( (target._x === (this._x + i)) && (target._y === (this._y - i)) ) _switch = true;
        }
        // return
        return _switch;
    }

    /**
     * @desc Sensor ​on the bottom-right. Diagonal
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorBottomRight = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        for (let i = 0; i < Math.floor(range) + 1; i++) {
            if ( (target._x === (this._x + i)) && (target._y === (this._y + i)) ) _switch = true;
        }
        // return
        return _switch;
    }

    /**
     * @desc Sensor ​on the bottom-right. Diagonal
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorBottomLeft = function(range, target) {
        // check out target
        if (this.sensorTargetValid(target) === false) return false;
        // variable
        var _switch = _switch || false;
        // check out
        for (let i = 0; i < Math.floor(range) + 1; i++) {
            if ( (target._x === (this._x - i)) && (target._y === (this._y + i)) ) _switch = true;
        }
        // return
        return _switch;
    }

    /**
     * @desc Sensor as cross form (x symbol). Sensor on all diagonal sides
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorDiagonal = function(range, target) {
        // return if any is true
        return (
            this.sensorTopLeft(range, target)       || 
            this.sensorTopRight(range, target)      ||
            this.sensorBottomLeft(range, target)    ||
            this.sensorBottomRight(range, target)
        );
    }

    /**
     * @desc Sensor just on vision of the event. In DIAGONAL side
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorDiagonalVision = function(range, target) {
        switch (this.direction()) {
            case 2: return (this.sensorBottomLeft(range, target)    || this.sensorBottomRight(range, target));
            case 4: return (this.sensorTopLeft(range, target)       || this.sensorBottomLeft(range, target));
            case 6: return (this.sensorBottomRight(range, target)   || this.sensorTopRight(range, target));
            case 8: return (this.sensorTopLeft(range, target)       || this.sensorTopRight(range, target));
            default: break;
        }
    }

    /**
     * @desc Sensor just on backs (behind) of the event. In DIAGONAL side
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorDiagonalBack = function(range, target) {
        switch (this.direction()) {
            case 8: return (this.sensorBottomLeft(range, target)    || this.sensorBottomRight(range, target));
            case 6: return (this.sensorTopLeft(range, target)       || this.sensorBottomLeft(range, target));
            case 4: return (this.sensorBottomRight(range, target)   || this.sensorTopRight(range, target));
            case 2: return (this.sensorTopLeft(range, target)       || this.sensorTopRight(range, target));
            default: break;
        }
    }

    /**
     * @desc Sensor on circle form.
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorCircle = function(range, target) {
        range = Math.floor(range) < 2 ? 2 : Math.floor(range);
        return (this.sensorDiagonal(range - 1, target) || this.sensorCross(range, target));
    }

    /**
     * @desc Sensor on full field of vision
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorFullVision = function(range, target) {
        range = Math.floor(range) < 2 ? 2 : Math.floor(range);
        return (
            this.sensorDiagonalVision(range, target)        ||
            this.sensorVision(range, target)
        );
    }

    /**
     * @desc Sensor on full field of vision
     * @param {number} range 
     * @param {Game_Character} target 
     * @returns {boolean} 
     */
    Game_Character.prototype.sensorFullBack = function(range, target) {
        range = Math.floor(range) < 2 ? 2 : Math.floor(range);
        return (
            this.sensorDiagonalBack(range, target)        ||
            this.sensorBack(range, target)
        );
    }
})(Ulse);
Imported["Ulse"] = true;
