"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _Adapter2 = _interopRequireDefault(require("./Adapter"));
var _hash = require("../../ecc/src/hash");
/**
 * Memory client adapter for CloudStorage class.
 * Implemented for testing purposes.
 */
var MemoryAdapter = /*#__PURE__*/function (_Adapter) {
  /**
   * @param {*} options required options: {}
   */
  function MemoryAdapter(options) {
    var _this;
    if (options === void 0) {
      options = {};
    }
    _this = _Adapter.call(this, options) || this;
    _this.memory = {};
    return _this;
  }

  /**
   * Store the passed value
   *
   * @param {string|Buffer} val
   * @param {Object} options
   * @returns {Promise<String>}
   */
  (0, _inheritsLoose2["default"])(MemoryAdapter, _Adapter);
  var _proto = MemoryAdapter.prototype;
  _proto.put =
  /*#__PURE__*/
  function () {
    var _put = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(val, options) {
      var id;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            id = (0, _hash.sha256)(val, 'hex');
            this.memory[id] = val;
            return _context.abrupt("return", id);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
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
   * @returns {Promise<Buffer>}
   */
  ;
  _proto.get =
  /*#__PURE__*/
  function () {
    var _get = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(key, options) {
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            return _context2.abrupt("return", this.memory[key]);
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
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
    var _delete2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(key, options) {
      var _this2 = this;
      return _regenerator["default"].wrap(function (_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              delete _this2.memory[key];
              resolve();
            }));
          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    function _delete(_x5, _x6) {
      return _delete2.apply(this, arguments);
    }
    return _delete;
  }();
  return MemoryAdapter;
}(_Adapter2["default"]);
var _default = exports["default"] = MemoryAdapter;
module.exports = exports.default;