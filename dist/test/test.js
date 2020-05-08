"use strict";

var _src = require("../src");

var _promisesAplusTests = _interopRequireDefault(require("promises-aplus-tests"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var adapter = {
  deferred: function deferred() {
    var pending = {};
    pending.promise = new _src.Promise(function (resolve, reject) {
      pending.resolve = resolve;
      pending.reject = reject;
    });
    return pending;
  }
};
(0, _promisesAplusTests["default"])(adapter, function (err) {});