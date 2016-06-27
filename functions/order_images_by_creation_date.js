'use strict';

/*
params:
    ownerId: self
*/
function describe(ec2, params, describeAction){
    return new Promise((resolve, reject) => {
        let params = params || {};
        console.log(params);
        ec2[describeAction](params, function(err, data) {
            if (err) reject({params: params, err:err});
            else resolve(data);
        });
    });
}

let listImages = (ec2, ownerId) => describe(ec2, {Owners: [ownerId]}, 'describeImages');
let listSnapshot = (ec2, ownerId) => describe(ec2, {OwnerIds: [ownerId]}, 'describeSnapshots');

module.exports = (ec2, params) => {
   console.log(params)
    params = params || {}
    return new Promise((resolve, reject) => {
        Promise.all([listImages(ec2, params.ownerId), listSnapshot(ec2, params.ownerId)])
            .then(resolve)
            .catch(reject);
    });
};
