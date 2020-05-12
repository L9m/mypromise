<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>

# @l9m/promise

A simple Promise/A+ implementation.

![npm](https://img.shields.io/npm/v/@l9m/promise)

## Installation

$ npm install promise

## Usage

The example below shows how you can load the promise library.There is a complete specification [Promises/A+](http://promises-aplus.github.com/promises-spec/).

```js
const Promise = require('@l9m/promise')
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('1000 ms')
  }, 1000)
})
```

## License

MIT
