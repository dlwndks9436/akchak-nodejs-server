import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import log from "./logger";

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "AKCHAK API Docs",
      version: process.env.npm_package_version as string,
      contact: { email: "dlwndks9436@gmail.com" },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: process.env.NODE_ENV === "production" ? "https" : "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    basePath: "/api",
  },
  apis:
    process.env.NODE_ENV === "production"
      ? [`./dist/routes/*.js`, "./dist/model/*.js"]
      : [`./src/routes/*.ts`, "./src/model/*.ts"],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  log.info(`Docs available at https://akchak.com:${port}/api/docs`);
}

export default swaggerDocs;
