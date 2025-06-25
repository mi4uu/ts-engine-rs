"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.ops = void 0;
var _serializer = _interopRequireDefault(require("./src/serializer"));
exports.Serializer = _serializer["default"];
var _FastParser = _interopRequireDefault(require("./src/FastParser"));
exports.fp = _FastParser["default"];
var _types = _interopRequireDefault(require("./src/types"));
exports.types = _types["default"];
var ops = _interopRequireWildcard(require("./src/operations"));
exports.ops = ops;
var _template = _interopRequireDefault(require("./src/template"));
exports.template = _template["default"];
var _SerializerValidation = _interopRequireDefault(require("./src/SerializerValidation"));
exports.SerializerValidation = _SerializerValidation["default"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }