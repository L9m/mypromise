import { Promise } from '../src'
import promiseAplusTests from 'promises-aplus-tests'

const adapter = {
  deferred() {
    const pending = {}
    pending.promise = new Promise((resolve, reject) => {
      pending.resolve = resolve
      pending.reject = reject
    })
    return pending
  }
}

promiseAplusTests(adapter, err => {

})