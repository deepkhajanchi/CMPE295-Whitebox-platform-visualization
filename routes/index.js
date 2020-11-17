const express = require('express');
const handlers = require('./handlers');

let router = express.Router();

router.route('/login').get(handlers.login);
router.route('/datasets').get(handlers.getDatasets);
router.route('/datasets/:datasetId').get(handlers.getDataset);
router.route('/models').get(handlers.getModels);
router.route('/tests').get(handlers.getTests);
router.route('/tests/:testId/result').get(handlers.getTestResult);
router.route('/tests/:testId/result/layers/:layerId').get(handlers.getLayer);
router.route('/tests/:testId/result/layers/:layerId/neurons/:neuronId').get(handlers.getSingleNeuronResult);


module.exports = router;