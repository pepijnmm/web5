var express = require('express');
var router = express.Router();
var racesController = require('../controllers/racesController');
var racesControllerhtml = require('../controllers/racesController_html');
var races = require('../models/race');
var jwt = require('jsonwebtoken');

/**
 * @swagger
 * /races:
 *   get:
 *     description: Returns races
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: races
 *         schema:
 *           type: array
 */
router.post('/location',needjson, racesController.getlocations);
router.put('/enable/:_id',needjson,isAdmincheck, racesController.enable);
 router.get('/', needjson, racesController.get);
 router.get('/',needshtml, racesControllerhtml.get);
 router.get('/create',needshtml, isAdmincheck, racesControllerhtml.getCreate);
 router.get('/:_id',needshtml, racesControllerhtml.show);
router.get('/:_id', needjson, racesController.get);
router.post('/', needjson,isAdmincheck, racesController.post);
router.delete('/:_id',needjson, isAdmincheck, racesController.delete);
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
