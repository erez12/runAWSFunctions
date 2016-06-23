'use strict';

module.exports = (ec2, params) => {
   return new Promise((resolve, reject) => {
      ec2.describeInstanceAttribute({ Attribute: 'userData', InstanceId: 'i-b5d3084d'}, function (err, data) {
         if (err || !data || !data.UserData || !data.UserData.Value) {
            resolve({})
            return;
         }

         try {
            resolve(JSON.parse(new Buffer(data.UserData.Value, 'base64').toString()));
         } catch(ex) {
            reject('decode failed: ' + ex.toString());
         }
      });

   });
};