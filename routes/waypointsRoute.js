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
 * /races/_id/location:
 *   post:
 *     description: Krijg informatie over een waypoint terug
 *     produces:
 *       Json
 *     parameters:
 *       - name: _id
 *         description:  het id van het aan te controlleren waypoint
 *         in: application/json
 *         required: true
 *         type: number
 */
router.post('/:_id/location',needjson, waypointsController.location);

   /**
 * @swagger
 *
 * /races/_oldid/waypoints/check/id:
 *   post:
 *     description: kroeg toevoegen bij kroegen waar gebruiker is langs geweest
 *     produces:
 *       Json
 *     parameters:
 *       - name: _oldid
 *         description: id van de race die de gebruiker doet
 *         in: application/json
 *         required: true
 *         type: number
 *       - name: _id
 *         description: id van het waypoint die de gebruiker is langs geweest
 *         in: application/json
 *         required: true
 *         type: number
 */
router.post('/:_oldid/waypoints/check/:_id',needjson, waypointsController.check);

   /**
 * @swagger
 *
 * /races/_id/waypoints/:
 *   delete:
 *     description: Verwijder een waypoint
 *     produces:
 *       Json
 *     parameters:
 *       - name: id
 *         description: Id van te verwijderen waypoint
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: waypoint deleted
 */
router.delete('/:_oldid/waypoints/:_id',needjson,isAdmincheck, waypointsController.delete);

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
