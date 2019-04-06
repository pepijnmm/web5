var express = require('express');
var router = express.Router();
var waypointsController = require('../controllers/waypointsController');
var waypointsControllerhtml = require('../controllers/waypointsController_html');
var waypoints = require('../models/waypoint');

router.get('/:_oldid/waypoints', waypointsController.getRace);
router.get('/:_oldid/waypoints/create', waypointsControllerhtml.getCreate);
router.post('/:_oldid/waypoints/create', waypointsController.posts);
router.post('/:_oldid/waypoints/check',verifyToken, waypointsController.check);
router.get('/', waypointsController.get);
router.get('/:_id', waypointsController.get);
router.post('/', waypointsController.post);
router.delete('/:_id', waypointsController.delete);

router.post('/', waypointsController.post);

module.exports = router;
