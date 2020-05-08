import {PENDING, FULFILLED, REJECTED} from './const/state'
import {isFunction, isObject} from './utils'

export class Promise {
  constructor(executor) {
    this._callbacks = []
    this._state = PENDING
    this._value = null
    executor(this._resolve.bind(this), this._reject.bind(this))
  }

  _isPending() {
    return this._state === PENDING
  }

  _isFulfilled() {
    return this._state === FULFILLED
  }

  _isRejected() {
    return this._state === REJECTED
  }

  _hasResolved() {
    return this._isFulfilled() || this._isRejected()
  }

  _resolve(x) {
    if (this._hasResolved()) return

    if (x === this) {
      throw new TypeError('Resolving object can not be the same object')
    } else if (x instanceof Promise) {
      x.then(this._resolve.bind(this), this._reject.bind(this))
    } else if (isObject(x) || isFunction(x)) {
      let called = false;
      try {
        const thenable = x.then
        if (isFunction(thenable)) {
          thenable.call(
            x,
            value => {
              !called && this._resolve(value)
              called = true
            },
            error => {
              !called && this._reject(error)
              called = true
            }
          )
        } else {
          this._fulfill(x)
        }
      } catch (err) {
        !called && this._reject(err)
      }
    } else {
      this._fulfill(x)
    }
  }

  _fulfill(result) {
    if (this._hasResolved()) return

    this._state = FULFILLED
    this._value = result
    this._callbacks.forEach(handler => this._callHandler(handler))
  }

  _reject(error) {
    if (this._hasResolved()) return

    this._state = REJECTED
    this._value = error
    this._callbacks.forEach(handler => this._callHandler(handler))
  }

  _addHandler(onFulfilled, onRejected) {
    this._callbacks.push({
      onFulfilled,
      onRejected
    })
  }

  _callHandler(handler) {
    if (this._isFulfilled() && isFunction(handler.onFulfilled)) {
      handler.onFulfilled(this._value)
    } else if (this._isRejected() && isFunction(handler.onRejected)) {
      handler.onRejected(this._value)
    }
  }

  then(onFulfilled, onRejected) {
    switch (this._state) {
      case PENDING: {
        return new Promise((resolve, reject) => {
            this._addHandler(
              (value) => {
                setTimeout(() => {
                  try {
                    if (isFunction(onFulfilled)) {
                      resolve(onFulfilled(value))
                    } else {
                      resolve(value)
                    }
                  } catch (err) {
                    reject(err)
                  }
                }, 0)
              },
              (error) => {
                setTimeout(() => {
                  try {
                    if (isFunction(onRejected)) {
                      resolve(onRejected(error))
                    } else {
                      reject(error)
                    }
                  } catch (err) {
                    reject(err)
                  }
                })
              }
            )
        })
      }
      case FULFILLED: {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              if (isFunction(onFulfilled)) {
                resolve(onFulfilled(this._value))
              } else {
                resolve(this._value)
              }
            } catch (err) {
              reject(err)
            }
          })
        })
      }
      case REJECTED: {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              if (isFunction(onRejected)) {
                resolve(onRejected(this._value))
              } else {
                reject(this._value)
              }
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    }
  }
}
