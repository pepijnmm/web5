var express = require('express');
var router = express.Router();
var waypointsController = require('../controllers/waypointsController');
var waypoints = require('../models/waypoint');

router.get('/', waypointsController.get);
router.get('/:_id', waypointsController.get)
router.post('/', waypointsController.post);
router.delete('/:_id', waypointsController.delete);

module.exports = router;
