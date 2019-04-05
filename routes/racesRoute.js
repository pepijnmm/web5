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
router.all('*',isAdmin);
router.get('/', needjson,verifyToken, racesController.get);
router.get('/',needshtml, racesControllerhtml.get);
router.get('/create',needshtml, racesControllerhtml.getCreate);
router.get('/:_id',needshtml, racesControllerhtml.show);
router.post('/location',needjson, racesController.getlocations);

router.get('/:_id', needjson, racesController.get);
router.post('/', needjson, racesController.post);
router.delete('/:_id',needjson, racesController.delete);
router.put('/:_id',needjson, racesController.edit);
router.put('/enable/:_id',needjson, racesController.accept);

function isAdmin(req, res, next)
{
    console.log('test');
    //get auth header val
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        req.token = bearerHeader.replace("Bearer ","");
        var decoded = jwt.verify(req.token, 'geheim');
        if(decoded != null && decoded){
            console.log(decoded.isAdmin);
            app.locals.isAdmin = decoded.isAdmin;
            next();
        }
    }
        next();
}
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
