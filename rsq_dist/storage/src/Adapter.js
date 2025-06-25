"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Adapter = /*#__PURE__*/function () {
  function Adapter(options) {
    if (options === void 0) {
      options = {};
    }
  }
  var _proto = Adapter.prototype;
  _proto.open = /*#__PURE__*/function () {
    var _open = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Promise.resolve());
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function open() {
      return _open.apply(this, arguments);
    }
    return open;
  }();
  _proto.close = /*#__PURE__*/function () {
    var _close = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Promise.resolve());
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function close() {
      return _close.apply(this, arguments);
    }
    return close;
  }()
  /**
   * Store the passed value under the passed key
   *
   * @param {Uint8Array} val
   * @param {Object} options
   * @returns {Promise<String>}
   */
  ;
  _proto.put =
  /*#__PURE__*/
  function () {
    var _put = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(val, options) {
      return _regenerator["default"].wrap(function (_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    function put(_x, _x2) {
      return _put.apply(this, arguments);
    }
    return put;
  }()
  /**
   * Retrieve the value for the passed key
   *
   * @param {String} key
   * @param {Object} options
   * @returns {Promise<Uint8Array>}
   */
  ;
  _proto.get =
  /*#__PURE__*/
  function () {
    var _get = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(key, options) {
      return _regenerator["default"].wrap(function (_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
          case 1:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    function get(_x3, _x4) {
      return _get.apply(this, arguments);
    }
    return get;
  }()
  /**
   * Remove the record for the passed key
   *
   * @param {String} key
   * @param {Object} options
   * @returns {Promise<boolean>}
   */
  ;
  _proto["delete"] =
  /*#__PURE__*/
  function () {
    var _delete2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(key, options) {
      return _regenerator["default"].wrap(function (_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
          case 1:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    function _delete(_x5, _x6) {
      return _delete2.apply(this, arguments);
    }
    return _delete;
  }();
  return Adapter;
}();
var _default = exports["default"] = Adapter;
module.exports = exports.default;