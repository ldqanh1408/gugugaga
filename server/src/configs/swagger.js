const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API docs",
      version: "1.0.0",
      description: "API documents",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/", // Cập nhật URL đúng với server
    },
  ],
  apis: ["./src/utils/swaggerDocs.js"], // Định nghĩa API trong các file routes
};

const swaggerSpec = swaggerJsdoc(options);
console.log(swaggerSpec)

module.exports = { swaggerUi, swaggerSpec };