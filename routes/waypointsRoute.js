var express = require('express');
var router = express.Router();
var waypointsController = require('../controllers/waypointsController');
var waypointsControllerhtml = require('../controllers/waypointsController_html');
var waypoints = require('../models/waypoint');

router.get('/', waypointsController.get);
router.get('/:_id', waypointsController.get);
router.post('/', waypointsController.post);
router.delete('/:_id', waypointsController.delete);
router.get('/:_oldid/waypoints', waypointsController.getRace);
router.post('/', waypointsController.post);

module.exports = router;
