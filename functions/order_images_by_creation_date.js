'use strict';

/*
params:
    ownerId: String
*/
function describe(ec2, ownerId, describeAction){
    return new Promise((resolve, reject) => {
        let params = {
            Owners: [ ownerId ||  'self' ]
        };

        ec2[describeAction](params, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
let listImages = (ec2, ownerId) => describe(ec2, ownerId, 'describeImages');
let listSnapshot = (ec2, ownerId) => describe(ec2, ownerId, 'describeSnapshots');

module.exports = (ec2, params) => {
    params = params || {}
    return new Promise((resolve, reject) => {
        Promise.all([listImages(ec2, params.ownerId), listSnapshot(ec2, params.ownerId)])
            .then(resolve)
            .catch(reject);
    });
};
