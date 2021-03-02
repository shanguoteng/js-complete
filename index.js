const promsie = require('./promise.js')
const promisesAplusTests = require("promises-aplus-tests")
promisesAplusTests(promsie,function(err){
    console.log(err);
})