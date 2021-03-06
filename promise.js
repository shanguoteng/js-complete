const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(execute) {
    let that = this
    that.onRejectedFn = []
    that.onFulfilledFn = []
    that.state = PENDING

    function resolve(value) {
        setTimeout(function () {
            if (that.state === PENDING) {
                that.state = FULFILLED
                that.value = value
                that.onFulfilledFn.forEach(function (fn) {
                    fn(that.value)
                })
            }
        })
    }

    function reject(reason) {
        setTimeout(function () {
            if (that.state === PENDING) {
                that.state = REJECTED
                that.reason = reason
                that.onRejectedFn.forEach(function (fn) {
                    fn(that.reason)
                })
            }
        })
    }
    try {
        execute(resolve, reject)
    } catch (e) {
        reject(e)
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (x) { return x }
    onRejected = typeof onRejected === 'function' ? onRejected : function (e) { throw e }
    let promise
    let that = this
    if (that.state === FULFILLED) {
        promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    const x = onFulfilled(that.value)
                    resolvePromise(promise, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })
    }
    if (that.state === REJECTED) {
        promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    const x = onRejected(that.reason)
                    resolvePromise(promise, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })
    }
    if (that.state === PENDING) {
        promise = new Promise(function (resolve, reject) {
            that.onFulfilledFn.push(function () {
                try {
                    const x = onFulfilled(that.value)
                    resolvePromise(promise, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
            that.onRejectedFn.push(function () {
                try {
                    const result = onRejected(that.reason)
                    resolvePromise(promise, result, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })

    }
    return promise
}
function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError('x 不能等于promise'))
    }
    else if (x instanceof Promise) {
        if (x.state === FULFILLED) {
            resolve(x.value)
        }
        else if (x.state === REJECTED) {
            reject(x.reason)
        }
        else {
            x.then(function (y) {
                resolvePromise(promise, y, resolve, reject)
            }, reject)
        }

    }
    else if (x !== null && (typeof x === 'object') || (typeof x === 'function')) {
        let executed
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (executed) return
                    executed = true
                    resolvePromise(promise, y, resolve, reject)
                }, function (e) {
                    if (executed) return
                    executed = true
                    reject(e)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (executed) return
            executed = true
            reject(e)
        }
    } else {
        resolve(x)
    }

}
module.exports = {
    deferred() {
        let resolve;
        let reject;
        let promise = new Promise(function (res, rej) {
            resolve = res
            reject = rej
        })
        return {
            promise,
            resolve,
            reject
        }
    }
}