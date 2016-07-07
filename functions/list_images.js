'use strict';

/*
params:
    ownerId: self
*/
function transformToHashByKeyValue(arr, key, value){
   return arr.reduce((obj, elem) => {
      obj[elem[key]] = elem[value];
      return obj;
   }, {});
}
function describe(ec2, params, describeAction){
    params = params || {};

    return new Promise((resolve, reject) => {
        ec2[describeAction](params, function(err, data) {
            if (err) reject({params: params, err:err});
            else resolve(data);
        });
    });
}

let listImages = (ec2, ownerId) => describe(ec2, {Owners: [ownerId]}, 'describeImages');
let listSnapshot = (ec2, ownerId) => describe(ec2, {OwnerIds: [ownerId]}, 'describeSnapshots');
let isEBS = elem => typeof elem.Ebs !== "undefined";

module.exports = (ec2, params) => {
    params = params || {};

    return Promise.all([listImages(ec2, params.ownerId), listSnapshot(ec2, params.ownerId)])
      .then((results) => {
         if (!results[0].Images) {
            return {images:[], rawResult: results[0].Images};
         }

         let snapShotsCreationTime = transformToHashByKeyValue(results[1].Snapshots, "SnapshotId", "StartTime");

         return results[0].Images.map((image) => {
            let ebsDevice = image.BlockDeviceMappings.find(isEBS).Ebs;
            let creationTime = image.State === 'available' ? (new Date(snapShotsCreationTime[ebsDevice.SnapshotId])).getTime() : Date.now();
            return {
               id: image.ImageId,
               status: (image.State === 'available') ? 'ACTIVE' : image.State.toUpperCase(),
               name: image.Name,
               creationTime: creationTime,
               tags: transformToHashByKeyValue(image.Tags, "Key", "Value")
            };
         });
      });
};
