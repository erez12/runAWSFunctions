'use strict';

/*
params:
    a: String
    b: [Int]
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
