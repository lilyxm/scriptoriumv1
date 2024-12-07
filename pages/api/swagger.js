// pages/api/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Documentation",
      version: "1.0.0",
      description: "An API documentation for 309Project",
    },
  },
  apis: ["./pages/api/**/*.js"], // Path to the API route files
};

const swaggerSpec = swaggerJSDoc(options);

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(swaggerSpec);
}
