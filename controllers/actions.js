"use strict"

const fs = require('fs');
let supportedActions = {};
let removeFileExtension = (x) => x.slice(0, -3);

function updateSupportedActions(){
    supportedActions = {};

    return new Promise(function(resolve, reject) {
        fs.readdir(__dirname + '/../functions', (e, files) => {
            let action = files.map(removeFileExtension).filter(action => action !== "base_code");
            action.forEach((a) => {
                supportedActions[a] = require("../functions/" + a);
            });
            resolve();
        });
    });
}

module.exports = () => {
    return updateSupportedActions().then(() => {
        // Don't care about promise value want to use actual
        return supportedActions;
    });
}
