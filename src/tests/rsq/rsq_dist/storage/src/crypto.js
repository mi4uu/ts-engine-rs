"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.make_content_key_noencrypt = exports.make_content_key = exports.encrypt_object = exports.encrypt_content_str = exports.encrypt_content = exports.encrypt_buffer = exports.decrypt_object = exports.decrypt_content_str = exports.decrypt_content = exports.decrypt_buffer = exports.crypto_content_transform = void 0;
var _secureRandom = _interopRequireDefault(require("secure-random"));
var _aes = _interopRequireDefault(require("crypto-js/aes"));
var _encHex = _interopRequireDefault(require("crypto-js/enc-hex"));
var _ecc = require("../../ecc");
////////////////////////////////////////////////////////////////////////////////////////////////////
// Encrypt object with subject private key and operator public key
// Return string with serialized representation of nonce and ciphertext
////////////////////////////////////////////////////////////////////////////////////////////////////
function encrypt_object(obj, subject_private_key, operator_public_key) {
  var nonce = _ecc.key.random32ByteBuffer().toString('base64');
  var cipherbuf = _ecc.Aes.encrypt_with_checksum(subject_private_key, operator_public_key, nonce, Buffer.from(JSON.stringify(obj), 'utf-8'));
  return nonce + ":" + cipherbuf.toString('base64');
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Decrypt string (serialized nonce and ciphertext data) with subject public key and operator private key
// Return original object as before encryption
////////////////////////////////////////////////////////////////////////////////////////////////////
function decrypt_object(str, subject_public_key, operator_private_key) {
  var parts = str.split(':', 2);
  var plainbuf = _ecc.Aes.decrypt_with_checksum(operator_private_key, subject_public_key, parts[0], Buffer.from(parts[1], 'base64'));
  return JSON.parse(plainbuf.toString('utf-8'));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Encrypt buffer with subject private key and operator public key
// Return buffer (nonce and ciphertext)
////////////////////////////////////////////////////////////////////////////////////////////////////
function encrypt_buffer(buf, subject_private_key, operator_public_key) {
  var noncebuf = _ecc.key.random32ByteBuffer();
  var cipherbuf = _ecc.Aes.encrypt_with_checksum(subject_private_key, operator_public_key, noncebuf.toString('base64'), buf);
  return Buffer.concat([Buffer.from([noncebuf.length]), noncebuf, cipherbuf]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Decrypt buffer (nonce and ciphertext) with subject public key and operator private key
// Return original buffer as before encryption
////////////////////////////////////////////////////////////////////////////////////////////////////
function decrypt_buffer(buf, subject_public_key, operator_private_key) {
  var noncelen = buf.slice(0, 1)[0];
  var noncebuf = buf.slice(1, 1 + noncelen);
  var cipherbuf = buf.slice(1 + noncelen);
  var plainbuf = _ecc.Aes.decrypt_with_checksum(operator_private_key, subject_public_key, noncebuf.toString('base64'), cipherbuf);
  return plainbuf;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Content encryption settings
////////////////////////////////////////////////////////////////////////////////////////////////////
var CONTENT_CIPHER_ALGORITHM = 'aes-256-cbc';
var CONTENT_CIPHER_ALGORITHM_KEY_SIZE = 32;
var CONTENT_CIPHER_ALGORITHM_IV_SIZE = 16;
var CONTENT_CIPHER_ALGORITHM_NOENCRYPT = 'noencrypt';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Create content encryption info (algorithm and random key and random IV)
////////////////////////////////////////////////////////////////////////////////////////////////////
function make_content_key() {
  return {
    algo: CONTENT_CIPHER_ALGORITHM,
    key: CONTENT_CIPHER_ALGORITHM_KEY_SIZE > 0 ? _secureRandom["default"].randomBuffer(CONTENT_CIPHER_ALGORITHM_KEY_SIZE).toString('hex') : null,
    iv: CONTENT_CIPHER_ALGORITHM_IV_SIZE > 0 ? _secureRandom["default"].randomBuffer(CONTENT_CIPHER_ALGORITHM_IV_SIZE).toString('hex') : null
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Create content encryption info with no encryption
////////////////////////////////////////////////////////////////////////////////////////////////////
function make_content_key_noencrypt() {
  return {
    algo: CONTENT_CIPHER_ALGORITHM_NOENCRYPT,
    key: null,
    iv: null
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Transform content buffer using cipher/decipher transform
////////////////////////////////////////////////////////////////////////////////////////////////////
function crypto_content_transform(transform, input) {
  var buf_main = transform.update(input);
  var buf_final = transform["final"]();
  return Buffer.concat([buf_main, buf_final]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Encrypt content buffer using key
////////////////////////////////////////////////////////////////////////////////////////////////////
function encrypt_content(plain_content_buf, content_key) {
  if (content_key.algo === CONTENT_CIPHER_ALGORITHM_NOENCRYPT) {
    return plain_content_buf;
  }
  if (content_key.algo !== CONTENT_CIPHER_ALGORITHM) {
    throw 'Unsupported cipher algorithm ' + content_key.algo;
  }
  var key_WA = _encHex["default"].parse(content_key.key);
  // if (key.length !== CONTENT_CIPHER_ALGORITHM_KEY_SIZE) {
  //     throw 'Unsupported cipher key size' + key.length;
  // }
  var plain_content_WA = _encHex["default"].parse(plain_content_buf.toString('hex'));
  var result_CP = content_key.iv ? _aes["default"].encrypt(plain_content_WA, key_WA, {
    iv: _encHex["default"].parse(content_key.iv)
  }) : _aes["default"].encrypt(plain_content_WA, key_WA);
  var result_WA = result_CP.ciphertext;
  return Buffer.from(result_WA.toString(_encHex["default"]), 'hex');
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Decrypt content buffer using key
////////////////////////////////////////////////////////////////////////////////////////////////////
function decrypt_content(cipher_content_buf, content_key) {
  if (content_key.algo === CONTENT_CIPHER_ALGORITHM_NOENCRYPT) {
    return cipher_content_buf;
  }
  if (content_key.algo !== CONTENT_CIPHER_ALGORITHM) {
    throw 'Unsupported cipher algorithm ' + content_key.algo;
  }
  var key_WA = _encHex["default"].parse(content_key.key);
  // if (key.length !== CONTENT_CIPHER_ALGORITHM_KEY_SIZE) {
  //     throw 'Unsupported cipher key size' + key.length;
  // }
  var cipher_content_WA = _encHex["default"].parse(cipher_content_buf.toString('hex'));
  var result_WA = content_key.iv ? _aes["default"].decrypt({
    ciphertext: cipher_content_WA,
    salt: null
  }, key_WA, {
    iv: _encHex["default"].parse(content_key.iv)
  }) : _aes["default"].decrypt({
    ciphertext: cipher_content_WA,
    salt: null
  }, key_WA);
  return Buffer.from(result_WA.toString(_encHex["default"]), 'hex');
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Encrypt content string using key
////////////////////////////////////////////////////////////////////////////////////////////////////
function encrypt_content_str(plain_content_str, content_key) {
  return encrypt_content(Buffer.from(plain_content_str, 'utf-8'), content_key).toString('base64');
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Decrypt content string using key
////////////////////////////////////////////////////////////////////////////////////////////////////
function decrypt_content_str(cipher_content_str, content_key) {
  return decrypt_content(Buffer.from(cipher_content_str, 'base64'), content_key).toString('utf-8');
}
var _encrypt_object = exports.encrypt_object = encrypt_object;
var _decrypt_object = exports.decrypt_object = decrypt_object;
var _encrypt_buffer = exports.encrypt_buffer = encrypt_buffer;
var _decrypt_buffer = exports.decrypt_buffer = decrypt_buffer;
var _make_content_key = exports.make_content_key = make_content_key;
var _make_content_key_noencrypt = exports.make_content_key_noencrypt = make_content_key_noencrypt;
var _crypto_content_transform = exports.crypto_content_transform = crypto_content_transform;
var _encrypt_content = exports.encrypt_content = encrypt_content;
var _decrypt_content = exports.decrypt_content = decrypt_content;
var _encrypt_content_str = exports.encrypt_content_str = encrypt_content_str;
var _decrypt_content_str = exports.decrypt_content_str = decrypt_content_str;