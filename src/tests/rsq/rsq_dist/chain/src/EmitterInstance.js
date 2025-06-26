"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = emitter;
var _eventEmitter = _interopRequireDefault(require("event-emitter"));
var _emitter;
function emitter() {
  if (!_emitter) {
    _emitter = (0, _eventEmitter["default"])({});
  }
  return _emitter;
}
module.exports = exports.default;