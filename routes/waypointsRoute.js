var express = require('express');
var router = express.Router();
var waypointsController = require('../controllers/waypointsController');
var waypointsControllerhtml = require('../controllers/waypointsController_html');
var waypoints = require('../models/waypoint');
var racesController = require('../controllers/racesController');

router.get('/:_oldid/waypoints',isAdmincheck, needshtml, waypointsControllerhtml.getWaypoints);
router.get('/:_oldid/waypoints/create',isAdmincheck,needshtml, waypointsControllerhtml.getCreate);
router.post('/:_oldid/waypoints/create',isAdmincheck, waypointsController.posts);

/**
 * @swagger
 *
 * /races/location:
 *   post:
 *     description: 
 *     produces:
 *       Json
 *     parameters:
 *       - name: adres
 *         description: straatnummer:postcode:plaats:land
 *         in: application/json
 *         required: true
 *         type: string
 *       - name: meter
 *         description: aantal meters
 *         in: application/json
 *         required: true
 *         type: number
 */
router.post('/location',needjson, racesController.getlocations);

   /**
 * @swagger
 *
 * /races/_oldid/waypoints/check/id:
 *   post:
 *     description: haal kroegen op basis van aantal meters van een adres
 *     produces:
 *       Json
 *     parameters:
 *       - name: adres
 *         description: straatnummer:postcode:plaats:land
 *         in: application/json
 *         required: true
 *         type: string
 *       - name: meter
 *         description: aantal meters
 *         in: application/json
 *         required: true
 *         type: number
 */
router.post('/:_oldid/waypoints/check/:_id',needjson, waypointsController.check);
router.get('/',needjson, waypointsController.get);
router.get('/:_id/waypoints',needjson, waypointsController.get);
router.post('/:_id/waypoints',needjson,isAdmincheck, waypointsController.post);
router.delete('/:_id/waypoints',needjson,isAdmincheck, waypointsController.delete);

   /**
 * @swagger
 *
 * /races/waypoints:
 *   post:
 *     description: Aanmaken van een waypoint
 *     produces:
 *       Json
 *     parameters:
 *       - name: _id
 *         description: het id van het aan te maken waypoint
 *         in: body
 *         required: true
 *         type: string
 */
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
