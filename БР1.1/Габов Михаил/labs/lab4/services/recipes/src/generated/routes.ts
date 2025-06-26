/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { IngredientController } from './../controllers/ingredient.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RecipeController } from './../controllers/recipe.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IngredientDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IngredientCreateDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IngredientUpdateDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeStepResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "stepNumber": {"dataType":"double","required":true},
            "description": {"dataType":"string","required":true},
            "imageUrl": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IngredientResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeIngredientResponseDto": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"string","required":true},
            "ingredient": {"ref":"IngredientResponseDto","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeDetailResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "difficulty": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"username":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"required":true},
            "steps": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeStepResponseDto"},"required":true},
            "recipeIngredients": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeIngredientResponseDto"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeIngredientCreateDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "name": {"dataType":"string","required":true},
            "amount": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeStepCreateDto": {
        "dataType": "refObject",
        "properties": {
            "stepNumber": {"dataType":"double","required":true},
            "description": {"dataType":"string","required":true},
            "imageUrl": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeCreateDto": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "difficulty": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"double","required":true}},"required":true},
            "ingredients": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeIngredientCreateDto"}},
            "steps": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeStepCreateDto"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeListResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "difficulty": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"username":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeUpdateDto": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "description": {"dataType":"string"},
            "difficulty": {"dataType":"string"},
            "steps": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeStepCreateDto"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsIngredientController_createIngredient: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IngredientCreateDto"},
        };
        app.post('/ingredients',
            ...(fetchMiddlewares<RequestHandler>(IngredientController)),
            ...(fetchMiddlewares<RequestHandler>(IngredientController.prototype.createIngredient)),

            async function IngredientController_createIngredient(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsIngredientController_createIngredient, request, response });

                const controller = new IngredientController();

              await templateService.apiHandler({
                methodName: 'createIngredient',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsIngredientController_getAllIngredients: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/ingredients',
            ...(fetchMiddlewares<RequestHandler>(IngredientController)),
            ...(fetchMiddlewares<RequestHandler>(IngredientController.prototype.getAllIngredients)),

            async function IngredientController_getAllIngredients(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsIngredientController_getAllIngredients, request, response });

                const controller = new IngredientController();

              await templateService.apiHandler({
                methodName: 'getAllIngredients',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsIngredientController_getIngredientById: Record<string, TsoaRoute.ParameterSchema> = {
                ingredientId: {"in":"path","name":"ingredientId","required":true,"dataType":"double"},
        };
        app.get('/ingredients/:ingredientId',
            ...(fetchMiddlewares<RequestHandler>(IngredientController)),
            ...(fetchMiddlewares<RequestHandler>(IngredientController.prototype.getIngredientById)),

            async function IngredientController_getIngredientById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsIngredientController_getIngredientById, request, response });

                const controller = new IngredientController();

              await templateService.apiHandler({
                methodName: 'getIngredientById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsIngredientController_updateIngredient: Record<string, TsoaRoute.ParameterSchema> = {
                ingredientId: {"in":"path","name":"ingredientId","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IngredientUpdateDto"},
        };
        app.put('/ingredients/:ingredientId',
            ...(fetchMiddlewares<RequestHandler>(IngredientController)),
            ...(fetchMiddlewares<RequestHandler>(IngredientController.prototype.updateIngredient)),

            async function IngredientController_updateIngredient(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsIngredientController_updateIngredient, request, response });

                const controller = new IngredientController();

              await templateService.apiHandler({
                methodName: 'updateIngredient',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsIngredientController_deleteIngredient: Record<string, TsoaRoute.ParameterSchema> = {
                ingredientId: {"in":"path","name":"ingredientId","required":true,"dataType":"double"},
        };
        app.delete('/ingredients/:ingredientId',
            ...(fetchMiddlewares<RequestHandler>(IngredientController)),
            ...(fetchMiddlewares<RequestHandler>(IngredientController.prototype.deleteIngredient)),

            async function IngredientController_deleteIngredient(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsIngredientController_deleteIngredient, request, response });

                const controller = new IngredientController();

              await templateService.apiHandler({
                methodName: 'deleteIngredient',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_createRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"RecipeCreateDto"},
                res: {"in":"res","name":"500","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}}},
        };
        app.post('/recipes',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.createRecipe)),

            async function RecipeController_createRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_createRecipe, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'createRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_getRecipes: Record<string, TsoaRoute.ParameterSchema> = {
                ingredient: {"in":"query","name":"ingredient","dataType":"string"},
                difficulty: {"in":"query","name":"difficulty","dataType":"string"},
        };
        app.get('/recipes',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.getRecipes)),

            async function RecipeController_getRecipes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_getRecipes, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'getRecipes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_getRecipeById: Record<string, TsoaRoute.ParameterSchema> = {
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"double"},
        };
        app.get('/recipes/:recipeId',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.getRecipeById)),

            async function RecipeController_getRecipeById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_getRecipeById, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'getRecipeById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_updateRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"RecipeUpdateDto"},
        };
        app.put('/recipes/:recipeId',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.updateRecipe)),

            async function RecipeController_updateRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_updateRecipe, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'updateRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_deleteRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"double"},
        };
        app.delete('/recipes/:recipeId',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.deleteRecipe)),

            async function RecipeController_deleteRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_deleteRecipe, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'deleteRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
