var express = require('express');
var router = express.Router();
var racesController = require('../controllers/racesController');

/**
 * @swagger
 * /users:
 *   get:
 *     description: Returns races
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: races
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Races'
 */
router.get('/', racesController.get);

module.exports = router;
