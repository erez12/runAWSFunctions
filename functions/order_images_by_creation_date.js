'use strict';

const listImages = require('./list_images');
const _ = require('lodash');
const moment = require('moment');

let imageCreationDay = image => moment(image.creationTime).startOf('day').format("DD-MM-YYYY");
let imageToCSV = region => image => [image.id, image.name, imageCreationDay(image), region].join(',');


function orderByDate(images){
   return _
      .chain(images)
      .sortBy('creationTime')
      .value();
}
let getImagesCSV = (region) => (images) => {
    console.log(region);
    return "id,name,creationTime,region\n" + orderByDate(images).map(imageToCSV(region)).join('\n');
};
/*
params:
    ownerId: self
*/
module.exports = (ec2, params) => listImages(ec2, params).then(getImagesCSV(ec2.config.region));