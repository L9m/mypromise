"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Promise = void 0;

var _state = require("./const/state");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Promise = /*#__PURE__*/function () {
  function Promise(executor) {
    _classCallCheck(this, Promise);

    this._callbacks = [];
    this._state = _state.PENDING;
    this._value = null;
    executor(this._resolve.bind(this), this._reject.bind(this));
  }

  _createClass(Promise, [{
    key: "_isPending",
    value: function _isPending() {
      return this._state === _state.PENDING;
    }
  }, {
    key: "_isFulfilled",
    value: function _isFulfilled() {
      return this._state === _state.FULFILLED;
    }
  }, {
    key: "_isRejected",
    value: function _isRejected() {
      return this._state === _state.REJECTED;
    }
  }, {
    key: "_hasResolved",
    value: function _hasResolved() {
      return this._isFulfilled() || this._isRejected();
    }
  }, {
    key: "_resolve",
    value: function _resolve(x) {
      var _this = this;

      if (this._hasResolved()) return;

      if (x === this) {
        throw new TypeError('Resolving object can not be the same object');
      } else if (x instanceof Promise) {
        x.then(this._resolve.bind(this), this._reject.bind(this));
      } else if ((0, _utils.isObject)(x) || (0, _utils.isFunction)(x)) {
        var called = false;

        try {
          var thenable = x.then;

          if ((0, _utils.isFunction)(thenable)) {
            thenable.call(x, function (value) {
              !called && _this._resolve(value);
              called = true;
            }, function (error) {
              !called && _this._reject(error);
              called = true;
            });
          } else {
            this._fulfill(x);
          }
        } catch (err) {
          !called && this._reject(err);
        }
      } else {
        this._fulfill(x);
      }
    }
  }, {
    key: "_fulfill",
    value: function _fulfill(result) {
      var _this2 = this;

      if (this._hasResolved()) return;
      this._state = _state.FULFILLED;
      this._value = result;

      this._callbacks.forEach(function (handler) {
        return _this2._callHandler(handler);
      });
    }
  }, {
    key: "_reject",
    value: function _reject(error) {
      var _this3 = this;

      if (this._hasResolved()) return;
      this._state = _state.REJECTED;
      this._value = error;

      this._callbacks.forEach(function (handler) {
        return _this3._callHandler(handler);
      });
    }
  }, {
    key: "_addHandler",
    value: function _addHandler(onFulfilled, onRejected) {
      this._callbacks.push({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      });
    }
  }, {
    key: "_callHandler",
    value: function _callHandler(handler) {
      if (this._isFulfilled() && (0, _utils.isFunction)(handler.onFulfilled)) {
        handler.onFulfilled(this._value);
      } else if (this._isRejected() && (0, _utils.isFunction)(handler.onRejected)) {
        handler.onRejected(this._value);
      }
    }
  }, {
    key: "then",
    value: function then(onFulfilled, onRejected) {
      var _this4 = this;

      switch (this._state) {
        case _state.PENDING:
          {
            return new Promise(function (resolve, reject) {
              _this4._addHandler(function (value) {
                setTimeout(function () {
                  try {
                    if ((0, _utils.isFunction)(onFulfilled)) {
                      resolve(onFulfilled(value));
                    } else {
                      resolve(value);
                    }
                  } catch (err) {
                    reject(err);
                  }
                }, 0);
              }, function (error) {
                setTimeout(function () {
                  try {
                    if ((0, _utils.isFunction)(onRejected)) {
                      resolve(onRejected(error));
                    } else {
                      reject(error);
                    }
                  } catch (err) {
                    reject(err);
                  }
                });
              });
            });
          }

        case _state.FULFILLED:
          {
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                try {
                  if ((0, _utils.isFunction)(onFulfilled)) {
                    resolve(onFulfilled(_this4._value));
                  } else {
                    resolve(_this4._value);
                  }
                } catch (err) {
                  reject(err);
                }
              });
            });
          }

        case _state.REJECTED:
          {
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                try {
                  if ((0, _utils.isFunction)(onRejected)) {
                    resolve(onRejected(_this4._value));
                  } else {
                    reject(_this4._value);
                  }
                } catch (err) {
                  reject(err);
                }
              });
            });
          }
      }
    }
  }, {
    key: "catch",
    value: function _catch(onRejected) {
      return this.then(null, onRejected);
    }
  }, {
    key: "finally",
    value: function _finally(callback) {
      if (!(0, _utils.isFunction)(onDone)) return this.then();
      var Promise = this.constructor;
      return this.then(function (value) {
        return Promise.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return Promise.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }
  }], [{
    key: "resolve",
    value: function resolve(x) {
      if (x instanceof Promise) {
        return x;
      } else if ((0, _utils.isObject)(x) || (0, _utils.isFunction)(x)) {
        try {
          var thenable = x.then;

          if ((0, _utils.isFunction)(thenable)) {
            return new Promise(function (resolve) {
              thenable(resolve);
            });
          } else {
            return new Promise(function (resolve) {
              return resolve(x);
            });
          }
        } catch (err) {
          return new Promise(function (resolve, reject) {
            return reject(err);
          });
        }
      } else {
        return new Promise(function (resolve) {
          return resolve(x);
        });
      }
    }
  }, {
    key: "reject",
    value: function reject(x) {
      if (x instanceof Promise) {
        return x;
      } else if ((0, _utils.isObject)(x) || (0, _utils.isFunction)(x)) {
        try {
          var thenable = x.then;

          if ((0, _utils.isFunction)(thenable)) {
            return new Promise(function (resolve, reject) {
              thenable(reject);
            });
          } else {
            return new Promise(function (resolve, reject) {
              return reject(err);
            });
          }
        } catch (err) {
          return new Promise(function (resolve, reject) {
            return reject(err);
          });
        }
      } else {
        return new Promise(function (resolve, reject) {
          return reject(err);
        });
      }
    }
  }, {
    key: "race",
    value: function race(promises) {
      return new Promise(function (resolve, reject) {
        if (!(0, _utils.isArray)(arr)) {
          return reject(new TypeError('Promise.race accepts an array'));
        }

        for (var i = 0; i < promises.length; i++) {
          Promise.resolve(promises[i]).then(function (value) {
            return resolve(value);
          }, function (reason) {
            return reject(reason);
          });
        }
      });
    }
  }, {
    key: "all",
    value: function all(promises) {
      return new Promise(function (resolve, reject) {
        if (!(0, _utils.isArray)(arr)) {
          return reject(new TypeError('Promise.all accepts an array'));
        }

        var count = 0;
        var length = promises.length;
        var results = Array.from({
          length: length
        });
        promises.forEach(function (promise, index) {
          Promise.resolve(promise).then(function (value) {
            count++;
            results[index] = value;

            if (count === length) {
              resolve(results);
            }
          }, function (reason) {
            return reject(reason);
          });
        });
      });
    }
  }]);

  return Promise;
}();

exports.Promise = Promise;