"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _Adapter2 = _interopRequireDefault(require("./Adapter"));
var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));
var _hash = require("../../ecc/src/hash");
/**
 * S3 client adapter for CloudStorage class.
 */
var S3Adapter = /*#__PURE__*/function (_Adapter) {
  /**
   * @param {*} options required options: {region, credentials: {}, params: {Bucket}}
   */
  function S3Adapter(options) {
    var _this;
    if (options === void 0) {
      options = {};
    }
    _this = _Adapter.call(this, options) || this;
    var opts = (0, _extends2["default"])({
      apiVersion: "2006-03-01"
    }, options);
    _this.client = new _s["default"](opts);
    return _this;
  }

  /**
   * Store the passed value under the passed key
   *
   * @param {string|Buffer} val
   * @param {Object} options
   * @returns {Promise<String>}
   */
  (0, _inheritsLoose2["default"])(S3Adapter, _Adapter);
  var _proto = S3Adapter.prototype;
  _proto.put =
  /*#__PURE__*/
  function () {
    var _put = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(val, options) {
      var _this2 = this;
      var id, params;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            id = (0, _hash.sha256)(val, 'hex');
            params = {
              Body: val,
              Key: id
            };
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              _this2.client.putObject(params).promise().then(function () {
                resolve(id);
              })["catch"](function (err) {
                reject(err);
              });
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
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
      var _this3 = this;
      var params;
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            params = {
              Key: key
            };
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              _this3.client.getObject(params).promise().then(function (data) {
                resolve(data.Body);
              })["catch"](function (err) {
                reject(err);
              });
            }));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
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
      var _this4 = this;
      var params;
      return _regenerator["default"].wrap(function (_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            params = {
              Key: key
            };
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              _this4.client.deleteObject(params).promise().then(function () {
                resolve();
              })["catch"](function (err) {
                reject(err);
              });
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
  return S3Adapter;
}(_Adapter2["default"]);
var _default = exports["default"] = S3Adapter;
module.exports = exports.default;