"use strict";

const fs = require('fs');
const actions = require('./actions');

module.exports = (req, res) => {
   let oldFunctionName = req.body.oldFunctionName;
   let newFunctionName = req.body.newFunctionName;
   let newFunctionBody = req.body.newFunctionBody;

   if (newFunctionName !== oldFunctionName) {
      fs.unlink(__dirname + "/../functions/" + oldFunctionName + ".js", (err) => {  });
   }
   fs.writeFile(__dirname + "/../functions/" + newFunctionName + ".js", newFunctionBody, function(err) {
      actions.updateAction(newFunctionName);
      res.json(err || "action updated");
   });
};
