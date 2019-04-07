var express = require('express');
var router = express.Router();
var waypointsController = require('../controllers/waypointsController');
var waypointsControllerhtml = require('../controllers/waypointsController_html');
var waypoints = require('../models/waypoint');

router.get('/:_oldid/waypoints',isAdmincheck, needshtml, waypointsControllerhtml.getRace);
router.get('/:_oldid/waypoints/create',isAdmincheck,needshtml, waypointsControllerhtml.getCreate);
router.post('/:_oldid/waypoints/create',isAdmincheck, waypointsController.posts);
router.post('/:_oldid/waypoints/check/:_id',needjson, waypointsController.check);
router.get('/',needjson, waypointsController.get);
router.get('/:_id/waypoint',needjson, waypointsController.getLocation);
router.get('/:_id/waypoints',needjson, waypointsController.get);
router.post('/:_id/waypoints',needjson,isAdmincheck, waypointsController.post);
router.delete('/:_id/waypoints',needjson,isAdmincheck, waypointsController.delete);

router.post('/', waypointsController.post);

function isAdmincheck(req, res, next)
{
    if(req.verifiedUser.user.isAdmin == true){
        next();
        return;
    }
    else{
        res.render('error')
        return false;
    }
}
function  needshtml(req, res, next) {
    if (req.headers["accept"] != undefined && req.headers["accept"] == 'application/json') {
        next('route')
    }
    else{next();}
}
function  needjson(req, res, next) {
    if (req.headers["accept"] != undefined && req.headers["accept"] == 'application/json') {
        next();
    } else {
        next('route');
    }
}

module.exports = router;
