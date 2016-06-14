'use strict';

module.exports = (ec2, params) => {
    params = params || {}
    return new Promise((resolve, reject) => {
        let params = {
            Owners: [ params.ownerId ||  'self' ]
        };

        ec2.describeImages(params, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
};
