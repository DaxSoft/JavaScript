// ============================================================================
// Plug-in: UltimateSensorEvent.js <> Haya System
// Version at 1.5.0
// Author: Dax Soft 
// Support: www.dax-soft.weebly.com
// ============================================================================
// - info
/*:
 * @author Dax Soft 
 * 
 * @plugindesc System of sensor. Used to make the npc detect your presence — of the player.
 * Very useful to games of the stealth: In that the player must keep your presence hidden, to continue.
 * The current system, contains more than twenty forms of detection of the player presence. 
 * Now, you can do a Sensor between Events.
 * 
 * @help
 * Contact:
 *     website: http://www.dax-soft.weebly.com
 * Check out the tutorial at http://tutorial-dax.weebly.com/ulse.html
 * ===========================================================================
*/
var Imported = Imported || {};
var Haya = Haya || {};
Haya.Ulse = {};
// Script:
(function($){
'use strict';
    // get the variable from a event id
    $.eventMap = function(eventId, defaultEventID) {
        return $gameMap.event(eventId == null ? Number(defaultEventID) : Number(eventId));
    }
    // sensor by area:
    Game_Interpreter.prototype.uArea = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            _swtich = ( ( Math.abs(event2.x - event.x) + Math.abs(event2.y - event.y) ) <= Math.abs(distance) );
        } else {
            var event = event || $.eventMap(id, this._eventId);
            _swtich = ( ( Math.abs($gamePlayer.x - event.x) + Math.abs($gamePlayer.y - event.y) ) <= Math.abs(distance) );
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich); 
        return _swtich;
    } 
    // sensor Above
    Game_Interpreter.prototype.uAbove = function(id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            _swtich = (event2.x == event.x && event2.y == event.y);
        } else {
            var event = event || $.eventMap(id, this._eventId);
            _swtich = ($gamePlayer.x == event.x && $gamePlayer.y == event.y);
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
    // sRight
    Game_Interpreter.prototype.uRight = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            if (event2.y == event.y) {
                for (var i = event.x + 1; i < event.x + Math.abs(distance); i++) {
                    if (!$gameMap.isPassable(i, event.y, 6)) break; 
                     if (event2.x == i) {
                         _swtich = true;
                     }
                }
            }
        } else {
            var event = event || $.eventMap(id, this._eventId);
            if ($gamePlayer.y == event.y) {
                for (var i = event.x + 1; i < event.x + Math.abs(distance); i++) {
                    if (!$gameMap.isPassable(i, event.y, 6)) break; 
                      if ($gamePlayer.x == i) {
                          _swtich = true;
                      }
                }
               }
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
    // sLeft
    Game_Interpreter.prototype.uLeft = function(distance, id, sid) {
            var _swtich = _swtich || false;
            if (Array.isArray(id)) {
                var event = event || $.eventMap(id[0], this._eventId);
                var event2 = event2 || $.eventMap(id[1], this._eventId);
                if (event2.y == event.y) {
                    for (var i = event.x + 1; i < event.x + Math.abs(distance); i++) {
                        if (!$gameMap.isPassable(i, event.y, 6)) break; 
                            if (event2.x == i - distance) {
                                _swtich = true;
                            }
                    }
                }
            } else {
                var event = event || $.eventMap(id, this._eventId);
                if ($gamePlayer.y == event.y) {
                    for (var i = event.x + 1; i < event.x + Math.abs(distance); i++) {
                        if (!$gameMap.isPassable(i, event.y, 6)) break; 
                            if ($gamePlayer.x == i - distance) {
                                _swtich = true;
                            }
                    }
                }
            }
            if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
            return _swtich;
    }
    // sFront
    Game_Interpreter.prototype.uFront = function(distance, id, sid) {
            var _swtich = _swtich || false;
            if (Array.isArray(id)) {
                var event = event || $.eventMap(id[0], this._eventId);
                var event2 = event2 || $.eventMap(id[1], this._eventId);
                if (event2.x == event.x) {
                    for (var i = event.y; i > event.y - (distance-1); i--) {
                        if ($gameMap.isPassable(event.x, i, 8)) {
                                if (event2.y == i) {
                                    _swtich = true;
                                }
                        }
                    }
                }
            } else {
                var event = event || $.eventMap(id, this._eventId);
                if ($gamePlayer.x == event.x) {
                    for (var i = event.y; i > event.y - (distance-1); i--) {
                        if ($gameMap.isPassable(event.x, i, 8)) {
                                if ($gamePlayer.y == i) {
                                    _swtich = true;
                                }
                        }
                    }
                }
            }
            if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
            return _swtich;
    }
    // sAgo
    Game_Interpreter.prototype.uAgo = function(distance, id, sid) {
            var _swtich = _swtich || false;
            if (Array.isArray(id)) {
                var event = event || $.eventMap(id[0], this._eventId);
                var event2 = event2 || $.eventMap(id[1], this._eventId);
                if (event2.x == event.x) {
                    for (var i = event.y; i > event.y - (distance); i--) {
                        if ($gameMap.isPassable(event.x, i, 8)) {
                            if (event2.y == (i+(distance))-1) {
                                _swtich = true;
                            }
                        }
                    }
                }
            } else {
                var event = event || $.eventMap(id, this._eventId);
                if ($gamePlayer.x == event.x) {
                    for (var i = event.y; i > event.y - (distance); i--) {
                        if ($gameMap.isPassable(event.x, i, 8)) {
                            if ($gamePlayer.y == (i+(distance))-1) {
                                _swtich = true;
                            }
                        }
                    }
                }
            }
            if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
            return _swtich;
    }
    // uCross
    Game_Interpreter.prototype.uCross = function(distance, id, sid) {
            return (  this.uAgo(distance, id, sid) || this.uFront(distance, id, sid) ||
                    this.uRight(distance, id, sid) || this.uLeft(distance, id, sid));
    }
    // uVision
    Game_Interpreter.prototype.uVision = function(distance, id, sid) {
        var event = event || $.eventMap(Array.isArray(id) ? id[0] : id, this._eventId);
        switch (event.direction()) {
            case 2:
                return this.uAgo(distance, id, sid);
            case 4:
                return this.uLeft(distance, id, sid);
            case 6:
                return this.uRight(distance, id, sid);
            case 8:
                return this.uFront(distance, id, sid);
            default:
                break;
        }
    }
    // uBehind
    Game_Interpreter.prototype.uBehind = function(distance, id, sid) {
        var event = event || $.eventMap(Array.isArray(id) ? id[0] : id, this._eventId);
        switch (event.direction()) {
            case 8:
                return this.uAgo(distance, id, sid);
            case 6:
                return this.uLeft(distance, id, sid);
            case 4:
                return this.uRight(distance, id, sid);
            case 2:
                return this.uFront(distance, id, sid);
            default:
                break;
        }
    }
    // vLeft
    Game_Interpreter.prototype.vLeft = function(distance, id, sid) {
        var event = event || $.eventMap(Array.isArray(id) ? id[0] : id, this._eventId);
        switch (event.direction()) {
            case 4:
                return this.uAgo(distance, id, sid);
            case 8:
                return this.uLeft(distance, id, sid);
            case 2:
                return this.uRight(distance, id, sid);
            case 6:
                return this.uFront(distance, id, sid);
            default:
                break;
        }
    }
    // vRight
    Game_Interpreter.prototype.vRight = function(distance, id, sid) {
        var event = event || $.eventMap(Array.isArray(id) ? id[0] : id, this._eventId);
        switch (event.direction()) {
            case 4:
                return this.uAgo(distance, id, sid);
            case 2:
                return this.uLeft(distance, id, sid);
            case 8:
                return this.uRight(distance, id, sid);
            case 6:
                return this.uFront(distance, id, sid);
            default:
                break;
        }
    }
    // dLeft
    Game_Interpreter.prototype.dLeft = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            for (var i = 0; i < distance+1; i++) {
               if ( (event2.x == (event.x - i)) && (event2.y == (event.y - i)) ) {
                    _swtich = true;
               }
            }
        } else {
            var event = event || $.eventMap(id, this._eventId);
            for (var i = 0; i < distance+1; i++) {
                if ( ($gamePlayer.x == (event.x - i)) && ($gamePlayer.y == (event.y - i)) ) {
                    _swtich = true;
                }
            }
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
    // dRight
    Game_Interpreter.prototype.dRight = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            for (var i = 0; i < distance+1; i++) {
                if ( (event2.x == (event.x + i)) && (event2.y == (event.y - i)) ) {
                    _swtich = true;
                }
            }
        } else {
            var event = event || $.eventMap(id, this._eventId);
            for (var i = 0; i < distance+1; i++) {
                 if ( ($gamePlayer.x == (event.x + i)) && ($gamePlayer.y == (event.y - i)) ) {
                     _swtich = true;
                 }
            }
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
    // diLeft
    Game_Interpreter.prototype.diLeft = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            for (var i = 0; i < distance+1; i++) {
                if ( (event2.x == (event.x - i)) && (event2.y == (event.y + i)) ) {
                    _swtich = true;
                }
            }
        } else {
            var event = event || $.eventMap(id, this._eventId);
            for (var i = 0; i <= distance; i++) {
                if ( ($gamePlayer.x == (event.x - i)) && ($gamePlayer.y == (event.y + i)) ) {
                    _swtich = true;
                }
            }
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
     // diRight
     Game_Interpreter.prototype.diRight = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) {
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            for (var i = 0; i < distance+1; i++) {
                if ( (event2.x == (event.x + i)) && (event2.y == (event.y + i)) ) {
                    _swtich = true;
                }
            }
        } else {
            var event = event || $.eventMap(id, this._eventId);
            for (var i = 0; i < distance+1; i++) {
                if ( ($gamePlayer.x == (event.x + i)) && ($gamePlayer.y == (event.y + i)) ) {
                    _swtich = true;
                }
            }
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
    // uDiagonal
    Game_Interpreter.prototype.uDiagonal = function(distance, id, sid) {
        return ( this.diLeft(distance, id, sid) || this.diRight(distance, id, sid) ||
                 this.dLeft(distance, id, sid)  || this.dRight(distance, id, sid));
    }
    // vDiagonal
    Game_Interpreter.prototype.vDiagonal = function(distance, id, sid) {
        var event = event || $.eventMap(Array.isArray(id) ? id[0] : id, this._eventId);
        switch (event.direction()) {
            case 2:
                return (this.diLeft(distance, id, sid) || this.diRight(distance, id, sid));
            case 4:
                return (this.dLeft(distance, id, sid) || this.diLeft(distance, id, sid));
            case 6:
                return (this.diRight(distance, id, sid) || this.dRight(distance, id, sid));
            case 8:
                return (this.dLeft(distance, id, sid) || this.dRight(distance, id, sid));
            default:
                break;
        }
    }
    // uCircle
    Game_Interpreter.prototype.uCircle = function(distance, id, sid) {
        var distance = distance < 2 ? 2 : distance;
        return ( this.uDiagonal(distance - 1, id, sid) || this.uCross(distance, id, sid));
    }
    // uCubic
    Game_Interpreter.prototype.uCubic = function(distance, id, sid) {
        var _swtich = _swtich || false;
        if (Array.isArray(id)) { // event
            var event = event || $.eventMap(id[0], this._eventId);
            var event2 = event2 || $.eventMap(id[1], this._eventId);
            switch (event.direction()) {
                case 2:
                    for (var x = event.x - (distance - 2); x < event.x + (distance - 2); x++) {
                        for (var y = event.y; y < event.y + distance; y++) {
                            if (event2.x == x && event2.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                case 4:
                    for (var i = 0; i < distance + 1; i++) {
                        for (var y = event.y - (distance - 2); y < event.y + (distance - 2); y++) {
                            if (event2.x == event.x - i && event2.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                case 6:
                    for (var i = 0; i < distance + 1; i++) {
                        for (var y = event.y - (distance - 2); y < event.y + (distance - 2); y++) {
                            if (event2.x == event.x + i && event2.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                case 8:
                    for (var x = event.x - (distance - 2); x < event.x + (distance - 2); x++) {
                        for (var y = event.y; y > event.y - distance; y--) {
                            if (event2.x == x && event2.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                default:
                    _swtich = false;
            }
        } else { // player
            var event = event || $.eventMap(id, this._eventId);
            switch (event.direction()) {
                case 2:
                    for (var x = event.x - (distance - 2); x < event.x + (distance - 2); x++) {
                        for (var y = event.y; y < event.y + distance; y++) {
                            if ($gamePlayer.x == x && $gamePlayer.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                case 4:
                    for (var i = 0; i < distance + 1; i++) {
                        for (var y = event.y - (distance - 2); y < event.y + (distance - 2); y++) {
                            if ($gamePlayer.x == event.x - i && $gamePlayer.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                case 6:
                    for (var i = 0; i < distance + 1; i++) {
                        for (var y = event.y - (distance - 2); y < event.y + (distance - 2); y++) {
                            if ($gamePlayer.x == event.x + i && $gamePlayer.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                case 8:
                    for (var x = event.x - (distance - 2); x < event.x + (distance - 2); x++) {
                        for (var y = event.y; y > event.y - distance; y--) {
                            if ($gamePlayer.x == x && $gamePlayer.y == y) {
                                _swtich = true;
                            }
                        }
                    }
                default:
                    _swtich = false;
            }
        }
        if (Number.isInteger(sid)) $gameSwitch.setValue(sid, _swtich);
        return _swtich;
    }
})(Haya.Ulse);
Imported.Ulse = true;
