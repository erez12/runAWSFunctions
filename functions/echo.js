'use strict';

/*
params:
   name: String
*/

module.exports = (ec2, params) => {
   return new Promise((resolve, reject) => {
       console.log('say hello to me: ' + params.name);
       resolve({"hello": params.name});
   });
};
