'use strict';

const listImages = require('./list_images');

module.exports = (ec2, params) => {
    params = params || {}
    return listImages(ec2, params.ownerId).then(data => data.Images.length);
};
