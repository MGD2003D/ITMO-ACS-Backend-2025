import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Recipes API",
            version: "1.0.0",
            description: "Документация CRUD-эндпоинтов для платформы рецептов"
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts"],
};
