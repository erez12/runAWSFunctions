'use strict';

/*
params:
   name: String
*/
module.exports = (ec2, params) => {
   return new Promise((resolve, reject) => {
       resolve({"hello": params.name});

   });
};
