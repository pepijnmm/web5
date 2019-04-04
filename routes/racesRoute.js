var express = require('express');
var router = express.Router();
var racesController = require('../controllers/racesController');
var racesControllerhtml = require('../controllers/racesController_html');
var races = require('../models/race');


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
router.get('/', racesController.get);
router.get('/:_id', racesController.get);
router.post('/', racesController.post);
router.delete('/:_id', racesController.delete);
router.put('/:_id', racesController.edit);
router.get('/', racesControllerhtml.get);
router.get('/create', racesControllerhtml.getCreate);
router.get('/:_id', racesControllerhtml.show);

module.exports = router;
