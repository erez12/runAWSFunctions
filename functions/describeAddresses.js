'use strict';
/*
params:
    PublicIps: [String]
*/
module.exports = (ec2, params) => {
    return new Promise((resolve, reject) => {
        ec2.describeAddresses(params, function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data.Addresses || []);
        });
    });
};
