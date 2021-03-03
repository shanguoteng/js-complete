# js-complete
手写各种实现
## PromiseA+规范
###  1. Terminology（术语）
---
1. Terminology（术语）
   
   1.1  “promise” is an object or function with a then method whose behavior conforms to this specification
   > promise 是一个拥有 then 方法的对象或者函数，其行为准守此规范

   1.2 "thenable" is an object or function that defines a then method
   > "thenable"是一个定义then的方法或者函数
   
   1.3   “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
   > "value"是任意的javaScript值(包括undefined,thenable或者promise)

   1.4 “exception” is a value that is thrown using the throw statement.
   > "exception"是一个由throw语句抛出的值

   1.5 “reason” is a value that indicates why a promise was rejected.
   > "reason"表示一个promise被拒绝的值

2. Requirements（需求）    
       2.1  A promise must be in one of three states: pending, fulfilled, or rejected.

      > 一个Promise必须处于 ` pengding`,`fulfulled`,`rejected`三个状态其中之一
      
