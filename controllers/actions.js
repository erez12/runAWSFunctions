"use strict"

const fs = require('fs');
let removeFileExtension = (x) => x.slice(0, -3);
let normelizeModuleName = n => "../functions/" + n;
function unloadModule(name){
   var path = require.resolve(normelizeModuleName(name));

   if (require.cache.hasOwnProperty(path) && require.cache[path].children) {
       require.cache[path].children.forEach(function (child) {
           unloadModule(child.id);
       });
   }

   delete require.cache[path];
}
module.exports.getSupportedActions = () => new Promise((resolve, reject) => {
   fs.readdir(__dirname + '/../functions', (e, files) => {
       resolve( files.map(removeFileExtension).filter(action => action !== "base_code") );
   });
});

// EREZ - support feture use of actions db
module.exports.getAction = (name) => new Promise((resolve, reject) => { resolve(require(normelizeModuleName(name))); });
module.exports.updateAction = (name) => new Promise((resolve, reject) => { resolve(unloadModule(name)); });
