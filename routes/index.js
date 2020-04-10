const express = require('express');
const xml = require('xml2js');
const fs = require('fs');


const builder = new xml.Builder({
  renderOpts: { pretty: false },
  headless: true,
  explicitRoot: true,
  rootName: 'result'
});
const router = express.Router();
const covid19ImpactEstimator = require('../estimator');

router.post('/api/v1/on-covid-19', (req, res) => {
  try {
    const { data } = req.body;
    const result = covid19ImpactEstimator(data);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/api/v1/on-covid-19/xml', (req, res) => {
  try {
    const { data } = req.body;
    const result = covid19ImpactEstimator(data);

    const resultXML = builder.buildObject(result);
    res.set('Content-Type', 'text/xml');
    res.status(200).send(resultXML);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/api/v1/on-covid-19/logs', (req, res) => {
  try {
    const data = fs.readFileSync('Httplog.txt', 'utf8');
    res.set('Content-Type', 'text/javascript');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
