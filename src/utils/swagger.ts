import { Constants } from "./constants"

export const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Twitter API",
        version: "1.0.0",
        description: "Twitter API NODEJS",
      },
      servers: [
        {
            url: 'http://localhost:'+Constants.PORT,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ["./src/domains/**/*.controller.ts"],
};