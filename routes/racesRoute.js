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

module.exports = router;
