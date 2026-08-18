import { Application } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym Booking API",
      version: "1.0.0",
      description: "API Documentation for Gym Management System",
    },
    servers: [{ url: "http://localhost:3000/api" }],
  },
  paths: {},
};

export const setupSwagger = (app: Application) => {
  app.use("api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
