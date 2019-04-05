var express = require('express');
var router = express.Router();
var racesController = require('../controllers/racesController');
var racesControllerhtml = require('../controllers/racesController_html');
var races = require('../models/race');
var json = false;
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
router.all('*',jsoncheck);
//router.get('/', racesControllerhtml.get);
router.get('/create', racesControllerhtml.getCreate);
router.get('/:_id', racesControllerhtml.show);
router.post('/location', racesController.getlocations);
router.get('/', verifyToken, racesController.get);
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
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        var decoded = jwt.verify(token, 'shhhhh');
        if(decoded != null && decoded)
        jwt.verify(req.token, 'geheim', function(err, decoded) {
            if (err) {
                res.sendStatus(403);
            }
            else{
                next();
            }
        });
    }else{
        res.sendStatus(403);
    }
}
function  jsoncheck(req, res, next){

    if(req.headers["accept"] != undefined && req.headers["accept"] == 'application/json') {
        json=true;
    }
    next();
}

module.exports = router;
