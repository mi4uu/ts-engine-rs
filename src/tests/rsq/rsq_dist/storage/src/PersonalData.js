"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _secureRandom = _interopRequireDefault(require("secure-random"));
var _ecc = require("../../ecc");
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var PersonalData = /*#__PURE__*/function () {
  function PersonalData() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // List of personal data parts
    // Personal data can be shared only by parts
    // Each part specified by fields path inside of whole personal data
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    this.PERSONAL_DATA_PART_PATHS = ['name', 'email', 'phone', 'photo'].sort();
    this.full_structure = this._defaultValue();
    this.enabled_parts = this.PERSONAL_DATA_PART_PATHS;
    this.salts = {};
    this.missings = {};
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Return a new PersonalData object from the result of PersonalData.getAllParts.
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  PersonalData.fromAllParts = function fromAllParts(data) {
    var inst = new PersonalData();
    inst.full_structure = JSON.parse(JSON.stringify(data.content));
    inst.enabled_parts = [];
    inst.salts = {};
    inst.missings = {};
    inst.PERSONAL_DATA_PART_PATHS.forEach(function (part_path) {
      var part = data.parts.find(function (obj) {
        return obj.path === part_path;
      });
      if (typeof part !== 'undefined') {
        inst.enabled_parts.push(part_path);
        inst.salts[part_path] = part.salt;
      }
      var missed_part = data.missed_parts.find(function (obj) {
        return obj.path === part_path;
      });
      if (typeof missed_part !== 'undefined') {
        inst.enabled_parts.push(part_path);
        inst.missings[part_path] = missed_part.hash;
      }
    });
    return inst;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Create personal data part
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  PersonalData.makeReference = function makeReference(url, type, hash) {
    return {
      url: url || '',
      type: type || '',
      hash: hash || ''
    };
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Update PD fields from a flat object. Missing fields will be overwriten with default values.
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  var _proto = PersonalData.prototype;
  _proto.assign = function assign(props) {
    this.setName(props.first_name, props.last_name);
    this.setEmail(props.email);
    this.setPhone(props.phone);
    this.setPhoto(props.photo);
  };
  _proto.setName = function setName(first_name, last_name) {
    this.setFirstName(first_name);
    this.setLastName(last_name);
  };
  _proto.setFirstName = function setFirstName(first_name) {
    this.full_structure.name.first = first_name || '';
  };
  _proto.setLastName = function setLastName(last_name) {
    this.full_structure.name.last = last_name || '';
  };
  _proto.setEmail = function setEmail(email) {
    this.full_structure.email = email || '';
  };
  _proto.setPhone = function setPhone(phone) {
    this.full_structure.phone = phone || '';
  };
  _proto.setPhoto = function setPhoto(photo) {
    this.full_structure.photo = photo || null;
  };
  _proto.getFirstName = function getFirstName() {
    return this.full_structure.name.first;
  };
  _proto.getLastName = function getLastName() {
    return this.full_structure.name.last;
  };
  _proto.getEmail = function getEmail() {
    return this.full_structure.email;
  };
  _proto.getPhone = function getPhone() {
    return this.full_structure.phone;
  };
  _proto.getPhoto = function getPhoto() {
    return this.full_structure.photo;
  };
  _proto.isAvailable = function isAvailable(part_name) {
    return typeof this.missings[part_name] === 'undefined';
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Create full personal data from its content
  // Return personal data structure
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  _proto.getAllParts = function getAllParts() {
    var _this = this;
    var content = this._deepSortObjKeys(this.full_structure);
    var res = {
      content: {},
      parts: [],
      missed_parts: []
    };
    this.enabled_parts.forEach(function (part_path) {
      var missed_hash = _this._getMissed(part_path);
      if (typeof missed_hash !== 'undefined') {
        res.missed_parts.push({
          path: part_path,
          hash: missed_hash
        });
      } else {
        var part_content = _this._getObjPart(content, part_path);
        if (part_content === undefined) {
          part_content = null;
        }
        _this._putObjPart(res.content, part_path, part_content);
        res.parts.push({
          path: part_path,
          salt: _this._getSalt(part_path)
        });
      }
    });
    return res;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Compute hash of personal data
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  _proto.getRootHash = function getRootHash() {
    var _this2 = this;
    var pd = this.getAllParts();
    var all_parts = pd.parts.concat(pd.missed_parts).sort(function (a, b) {
      return a.path.localeCompare(b.path);
    });
    return this._computeSha256(all_parts.map(function (part) {
      return part.salt ? _this2._computeSha256(part.salt + ":" + JSON.stringify(_this2._getObjPart(pd.content, part.path))) : part.hash;
    }).join());
  };
  _proto.makePartial = function makePartial(limited_parts) {
    var _this3 = this;
    var inst = new PersonalData();
    inst.enabled_parts = this.enabled_parts;
    this.PERSONAL_DATA_PART_PATHS.forEach(function (part_path) {
      if (limited_parts.indexOf(part_path) >= 0) {
        inst.full_structure[part_path] = _this3._deepClone(_this3.full_structure[part_path]);
        inst.salts[part_path] = _this3._getSalt(part_path);
      } else {
        var miss = _this3._getMissed(part_path);
        if (typeof miss !== 'undefined') {
          inst.missings[part_path] = miss;
        } else {
          inst.missings[part_path] = _this3._computeHash(part_path);
        }
      }
    });
    return inst;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Return new object with sorted keys/values pairs from input object (handle nested objects too)
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  _proto._deepSortObjKeys = function _deepSortObjKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    var keys = Object.keys(obj).sort();
    var ret = {};
    for (var _iterator = _createForOfIteratorHelperLoose(keys), _step; !(_step = _iterator()).done;) {
      var key = _step.value;
      var val = obj[key];
      ret[key] = this._deepSortObjKeys(val);
    }
    return ret;
  };
  _proto._defaultValue = function _defaultValue() {
    return {
      name: {
        first: '',
        last: ''
      },
      email: '',
      phone: '',
      photo: null
    };
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Returns part of object with specified path
  // Path must contains period-delimited field names
  // For empty path returns input object
  // Returns undefined if path not found
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  _proto._getObjPart = function _getObjPart(obj, part_path) {
    var ret = obj;
    if (part_path) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(part_path.split('.')), _step2; !(_step2 = _iterator2()).done;) {
        var elem = _step2.value;
        if (elem in ret) {
          ret = ret[elem];
        } else {
          ret = undefined;
          break;
        }
      }
    }
    return ret;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Set part of object with specified path
  // Path must contains period-delimited field names
  // For empty path channges input object
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  _proto._putObjPart = function _putObjPart(obj, part_path, part) {
    var part_path_elems = part_path ? part_path.split('.') : [];
    if (part_path_elems.length > 0) {
      var dst = obj;
      var prefix_elems = part_path_elems.slice(0, -1);
      for (var _iterator3 = _createForOfIteratorHelperLoose(prefix_elems), _step3; !(_step3 = _iterator3()).done;) {
        var elem = _step3.value;
        if (elem in dst) {
          dst = dst[elem];
        } else {
          dst = dst[elem] = {};
          break;
        }
      }
      var last_elem = part_path_elems[part_path_elems.length - 1];
      dst[last_elem] = part;
    } else {
      var old_keys = Object.keys(obj);
      for (var _i = 0, _old_keys = old_keys; _i < _old_keys.length; _i++) {
        var k = _old_keys[_i];
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          delete obj[k];
        }
      }
      var new_keys = Object.keys(part);
      for (var _i2 = 0, _new_keys = new_keys; _i2 < _new_keys.length; _i2++) {
        var _k = _new_keys[_i2];
        if (Object.prototype.hasOwnProperty.call(part, _k)) {
          obj[_k] = part[_k];
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Compute SHA256 hash of string
  // Return hex lowercase representation of hash
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ;
  _proto._computeSha256 = function _computeSha256(str) {
    var buf = Buffer.from(str.toString(), 'utf-8');
    return _ecc.hash.sha256(buf).toString('hex');
  };
  _proto._getSalt = function _getSalt(path) {
    if (typeof this.salts[path] === 'undefined') {
      this.salts[path] = _secureRandom["default"].randomBuffer(8).toString('base64');
    }
    return this.salts[path];
  };
  _proto._getMissed = function _getMissed(path) {
    return this.missings[path];
  };
  _proto._computeHash = function _computeHash(path) {
    var salt = this._getSalt(path);
    var content = this._deepSortObjKeys(this._getObjPart(this.full_structure, path));
    return this._computeSha256(salt + ":" + JSON.stringify(content));
  };
  _proto._deepClone = function _deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  };
  return PersonalData;
}();
var _default = exports["default"] = PersonalData;
module.exports = exports.default;