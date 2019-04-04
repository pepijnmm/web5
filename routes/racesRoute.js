var express = require('express');
var router = express.Router();
var racesController = require('../controllers/racesController');
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
router.get('/test', racesController.getlocations);
router.get('/:_id', racesController.get);
router.post('/', racesController.post);
router.delete('/:_id', racesController.delete);
router.put('/:_id', racesController.edit);

module.exports = router;
