"use strict";

const fs = require('fs');
module.exports = (req, res) => {
    let functionName = req.body.functionName;
    let functionBody = req.body.functionBody;

    fs.writeFile(__dirname + "/../functions/" + functionName + ".js", functionBody, function(err) {
        res.json(err || "action added");
    });

};
