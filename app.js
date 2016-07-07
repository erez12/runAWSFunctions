"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const actions = require('./controllers/actions');
const regions = require('./controllers/regions');
const runAction = require('./controllers/run_action');
const createAction = require('./controllers/create_action');
const editAction = require('./controllers/edit_action');

const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/functions', express.static('functions'));
app.use(express.static('public'));

app.get('/actions', (req, res) => actions.getSupportedActions().then((a) => res.send(a)));
app.get('/regions', regions.supportedRegions);

app.post('/run', runAction);
app.post('/create', createAction);
app.post('/edit', editAction);

app.listen(3001, () => {
  console.log("running on port 3001");
});
