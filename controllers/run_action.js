"use strict";

const AWS = require('aws-sdk');
// const AWS = require('./test/aws_mock');
const proxyagent = require('proxy-agent');
const config = require('../config/config.json');
const actions = require('./actions');
// Global AWS configs
AWS.config.update({
  maxRetries: 5,
  sslEnabled: true,
  logger: process.stdout,
  httpOptions: { agent: proxyagent(config.tunnelingProxyURL)}
});

function createEc2Instance(region){
    let credentials = config.credentials;

    AWS.config.update({
      region: region,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey
    });

    return new AWS.EC2();
}

function runAction(req, res){
    let region = req.body.region;
    let params = req.body.params;

    let ec2 = createEc2Instance(region);
    let requestAction = req.body.action;

    actions.getSupportedActions().then((supportedActions) => {
      if (supportedActions.indexOf(requestAction) < 0 ){
         res.json({"error": "no such method"});
         return;
      }
      actions.getAction(requestAction).then((action) => {
         action(ec2, params)
            .then((result) => {
                res.json({"result": result})
            })
            .catch(e => res.json({"error": e}));
      });
    });
}

module.exports = runAction;
