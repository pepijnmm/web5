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
router.get('/', needjson,verifyToken, racesController.get);
router.get('/',needshtml, racesControllerhtml.get);
router.get('/create', racesControllerhtml.getCreate);
router.get('/:_id', racesControllerhtml.show);
router.post('/location', racesController.getlocations);

router.get('/:_id', racesController.get);
router.post('/', racesController.post);
router.delete('/:_id', racesController.delete);
router.put('/:_id', racesController.edit);
router.put('/enable/:_id', racesController.accept);

function verifyToken(req, res, next)
{
    //get auth header val
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        req.token = bearerHeader.replace("Bearer ","");
        var decoded = jwt.verify(req.token, 'geheim');
        if(decoded != null && decoded){
            next();
        }
        else{
            res.sendStatus(403);
        }
    }else{
        res.sendStatus(403);
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
