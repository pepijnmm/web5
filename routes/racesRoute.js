var express = require('express');
var router = express.Router();
var racesController = require('../controllers/racesController');
var racesControllerhtml = require('../controllers/racesController_html');
var races = require('../models/race');
var jwt = require('jsonwebtoken');

/**
 * @swagger
 *
 * /races/locations:
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
router.post('/location',needjson, racesController.getlocations);
    /**
 * @swagger
 *
  * /races/enable/id:
 *   put:
 *     description: Start een race
 *     produces:
 *       Json
 *     parameters:
 *       - name: _id
 *         description: Id van het te starten race
 *         in: application/json
 *         required: true
 *         type: boolean
 *     responses:
 *       201:
 *         description: Race met updated informatie
 */
router.put('/enable/:_id',needjson,isAdmincheck, racesController.enable);


    /**
 * @swagger
 *
  * /races/:
 *   get:
 *     description: haal alle races op
 *     produces:
 *       Json
 *     parameters:
 *       - name: byStarted
 *         description: query om alleen gestarte races op te halen
 *         in: Query
 *         required: false
 *         type: boolean
 *       - name: hasWaypoint
 *         description: query om alle races die een bepaalde kroeg heeft op halen
 *         in: Query
 *         required: false
 *         type: Waypoint _id
 *       - name: pageIndex
 *         description: pagina x ophalen
 *         in: Query
 *         required: false
 *         type: number
 *       - name: pageSize
 *         description: aantal races per pagina
 *         in: Query
 *         required: false
 *         type: number
 *     responses:
 *       201:
 *         description: haalt races op
 */
 router.get('/', needjson, racesController.get);
router.get('/',needshtml, racesControllerhtml.get);
router.get('/:_id/edit',needshtml, isAdmincheck, racesControllerhtml.edit);
 router.get('/create',needshtml, isAdmincheck, racesControllerhtml.getCreate);
 router.get('/:_id',needshtml, racesControllerhtml.show);

/**
 * @swagger
 *
  * /races/id:
 *   get:
 *     description: haal race met id op
 *     produces:
 *       Json
 *     parameters:
 *       - name: id
 *         description: id van te op te halen race
 *         in: Parameter races/:id
 *         required: true
 *         type: string
 *       - name: byStarted
 *         description: query om alleen gestarte races op te halen
 *         in: Query
 *         required: false
 *         type: boolean
 *       - name: hasWaypoint
 *         description: query om alle races die een bepaalde kroeg heeft op halen
 *         in: Query
 *         required: false
 *         type: Waypoint _id
 *       - name: pageIndex
 *         description: pagina x ophalen
 *         in: Query
 *         required: false
 *         type: number
 *       - name: pageSize
 *         description: aantal races per pagina
 *         in: Query
 *         required: false
 *         type: number
 *     responses:
 *       201:
 *         description: race met opgegeven ID
 */
router.get('/:_id', needjson, racesController.get);

   /**
 * @swagger
 *
  * /races/:
 *   post:
 *     description: create een nieuwe race
 *     produces:
 *       Json
 *     parameters:
 *       - name: race
 *         description: race die toegevoegd moet worden
 *         in: body
 *         required: true
 *         type: Race
 *     responses:
 *       201:
 *         description: Race met updated informatie
 */
router.post('/', needjson,isAdmincheck, racesController.post);

   /**
 * @swagger
 *
  * /races/id:
 *   delete:
 *     description: verwijder een race
 *     produces:
 *       Json
 *     parameters:
 *       - name: _id
 *         description: id van te verwijderen race
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Haalt race met _id weg
 */
router.delete('/:_id',needjson, isAdmincheck, racesController.delete);

   /**
 * @swagger
 *
  * /races/id:
 *   put:
 *     description: verander de naam / id van een race
 *     produces:
 *       Json
 *     parameters:
 *       - name: _id
 *         description: id met nieuwe naam
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:_id',needjson, isAdmincheck, racesController.edit);




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
