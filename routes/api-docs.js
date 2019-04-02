var express = require('express');
var router = express.Router();
var swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
      info: {
        title: 'Hello World', // Title (required)
        version: '1.0.0', // Version (required)
      },
    },
    // Path to the API docs
    apis: ['./routes.js', 'routes/racesRoute.js'],
  };
  
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);


router.get('/api-docs.json', (req, res) => {
  console.log('lol');
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

  module.exports = router;