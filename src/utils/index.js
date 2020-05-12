export const isFunction = val => val && typeof val === 'function'

export const isObject = val => val && typeof val === 'object'

export const isArray = val => val && typeof Object.prototype.toString.call(val) === '[object Array]'