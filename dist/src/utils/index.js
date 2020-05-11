"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = exports.isFunction = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isFunction = function isFunction(val) {
  return val && typeof val === 'function';
};

exports.isFunction = isFunction;

var isObject = function isObject(val) {
  return val && _typeof(val) === 'object';
};

exports.isObject = isObject;