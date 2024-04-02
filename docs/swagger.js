/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',   // Enable/Disable OpenAPI. By default is null
    language: 'en-US',      // Change response language. By default is 'en-US'
    disableLogs: false,     // Enable/Disable logs. By default is false
    autoHeaders: false,     // Enable/Disable automatic headers capture. By default is true
    autoQuery: false,       // Enable/Disable automatic query capture. By default is true
    autoBody: false         // Enable/Disable automatic body capture. By default is true
}

// const config = require('../config/cloud');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '2.0.0',      // by default: '1.0.0'
    title: 'Assignment APIs',        // by default: 'REST API'
    description: '',  // by default: ''
    contact: {
        'name': 'Raj Karmakar',
        'email': '97rajmath@gmail.com'
    },
  },
  // host: config.swagger.host,      // by default: 'localhost:3000'
  basePath: '/',  // by default: '/'
  schemes: ['http'],   // by default: ['http']
  consumes: ['application/json'],  // by default: ['application/json']
  produces: ['application/json'],  // by default: ['application/json']
  tags: [],      
  securityDefinitions: {},
  definitions: {
    "successResponse.200": {
      "code": 200,
      "message": "",
      "data": "" | [],
      
    },
    'errorResponse.404': {
      "code": "404",
      "message": "Not found",
    },
  },          // by default: empty object (Swagger 2.0)
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['../index.js', '../controllers/*.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */
// swaggerAutogen(outputFile, endpointsFiles, doc);

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../index.js'); // Your project's root file
  });