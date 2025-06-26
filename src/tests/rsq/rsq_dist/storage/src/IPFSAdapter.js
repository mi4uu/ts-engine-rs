"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _Adapter2 = _interopRequireDefault(require("./Adapter"));
var _ipfsHttpClient = _interopRequireDefault(require("ipfs-http-client"));
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(r) { var n = this.s["return"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, "throw": function _throw(r) { var n = this.s["return"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
/**
 * IPFS client adapter for CloudStorage class.
 */
var IPFSAdapter = /*#__PURE__*/function (_Adapter) {
  /**
   * @param {*} options required options: {}
   */
  function IPFSAdapter(options) {
    var _this;
    if (options === void 0) {
      options = {};
    }
    _this = _Adapter.call(this, options) || this;
    _this.client = new _ipfsHttpClient["default"](options);
    return _this;
  }

  /**
   * Store the passed value
   *
   * @param {string|Buffer} val
   * @param {Object} options
   * @returns {Promise<String>}
   */
  (0, _inheritsLoose2["default"])(IPFSAdapter, _Adapter);
  var _proto = IPFSAdapter.prototype;
  _proto.put =
  /*#__PURE__*/
  function () {
    var _put = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(val, options) {
      var _yield$this$client$ad, cid;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            _context.next = 1;
            return this.client.add(val);
          case 1:
            _yield$this$client$ad = _context.sent;
            cid = _yield$this$client$ad.cid;
            return _context.abrupt("return", cid.toString());
          case 2:
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
      var chunks, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, _t;
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            chunks = [];
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context2.prev = 1;
            _iterator = _asyncIterator(this.client.cat(key));
          case 2:
            _context2.next = 3;
            return _iterator.next();
          case 3:
            if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
              _context2.next = 5;
              break;
            }
            chunk = _step.value;
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
          case 4:
            _iteratorAbruptCompletion = false;
            _context2.next = 2;
            break;
          case 5:
            _context2.next = 7;
            break;
          case 6:
            _context2.prev = 6;
            _t = _context2["catch"](1);
            _didIteratorError = true;
            _iteratorError = _t;
          case 7:
            _context2.prev = 7;
            _context2.prev = 8;
            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context2.next = 9;
              break;
            }
            _context2.next = 9;
            return _iterator["return"]();
          case 9:
            _context2.prev = 9;
            if (!_didIteratorError) {
              _context2.next = 10;
              break;
            }
            throw _iteratorError;
          case 10:
            return _context2.finish(9);
          case 11:
            return _context2.finish(7);
          case 12:
            return _context2.abrupt("return", Buffer.concat(chunks));
          case 13:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this, [[1, 6, 7, 12], [8,, 9, 11]]);
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
      return _regenerator["default"].wrap(function (_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              reject('IPFSAdapter doesn\'t implement delete function');
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
  return IPFSAdapter;
}(_Adapter2["default"]);
var _default = exports["default"] = IPFSAdapter;
module.exports = exports.default;