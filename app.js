"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const actions = require('./controllers/actions');
const regions = require('./controllers/regions');
const runAction = require('./controllers/run_action');
const createAction = require('./controllers/create_action');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));
app.get('/actions', (req, res) => actions().then((a) => res.send(Object.keys(a))));
app.get('/regions', regions.supportedRegions);

app.post('/run', runAction);
app.post('/create', createAction);

app.listen(3001, () => {
  console.log("running on port 3001");
});