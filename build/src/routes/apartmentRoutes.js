"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const apartmentController_1 = require("../controllers/apartmentController");
const controller = new apartmentController_1.apartmentController();
const basePath = "/api/v1/";
const apartmentRoutes = [
    {
        method: 'POST',
        path: `${basePath}createApartment`,
        handler: controller.createApartment,
        options: {
            auth: 'jwt',
            plugins: { 'hapiAuthorization': { roles: ['TENANT'] } },
            description: 'Create an Apartment',
            notes: 'Login as Tenant and create an apartment, response is the apartment object.',
            tags: ['api'],
            validate: {
                headers: joi_1.default.object({
                    authorization: joi_1.default.string().required()
                }).options({ allowUnknown: true }),
                payload: joi_1.default.object({
                    location: {
                        apartmentNumber: joi_1.default.number().min(0).max(1000000),
                        streetName: joi_1.default.string().min(2).max(300).required(),
                        town: joi_1.default.string().min(2).max(300).optional(),
                        zipcode: joi_1.default.number().min(2).max(1000000).required(),
                        city: joi_1.default.string().min(2).max(300).required(),
                        country: joi_1.default.string().min(2).max(30).required()
                    },
                    details: {
                        title: joi_1.default.string().min(3).max(30).required(),
                        description: joi_1.default.string().min(3).max(200).required(),
                    },
                    layout: {
                        noOfRooms: joi_1.default.number().min(1).max(20),
                        noOfBedrooms: joi_1.default.number().min(1).max(10),
                        isDining: joi_1.default.boolean(),
                        isKitchen: joi_1.default.boolean()
                    },
                    apartmentStructure: {
                        floorNo: joi_1.default.number().min(0).max(100).required(),
                        areaSqMts: joi_1.default.number().min(100).max(2000).required()
                    },
                    amenities: {
                        general: {
                            isWashing: joi_1.default.boolean(),
                            isHeating: joi_1.default.boolean(),
                        },
                        additional: {
                            isCoffeeMachine: joi_1.default.boolean(),
                            isToaster: joi_1.default.boolean()
                        }
                    },
                    pricing: {
                        rentInEuro: joi_1.default.number().min(100).max(5000).required(),
                        depositMonths: joi_1.default.number().min(0).max(12).required(),
                    }
                })
            }
        }
    },
    {
        method: 'POST',
        path: `${basePath}searchApartment`,
        handler: controller.searchApartment,
        options: {
            auth: 'jwt',
            plugins: { 'hapiAuthorization': { roles: ['TENANT', 'USER'] } },
            description: 'Search for apartments',
            notes: 'Get all nearby apartments by passing filters like city, country, no of rooms etc. Returns array of apartments',
            tags: ['api'],
            validate: {
                headers: joi_1.default.object({
                    authorization: joi_1.default.string().required()
                }).options({ allowUnknown: true }),
                payload: joi_1.default.object({
                    location: {
                        address: joi_1.default.string().min(2).max(300).allow(''),
                        city: joi_1.default.string().min(2).max(300).allow(''),
                        country: joi_1.default.string().min(2).max(30).allow('')
                    },
                    filter: {
                        noOfRooms: joi_1.default.number().min(1).max(20).required(),
                        nearestToKms: joi_1.default.allow(10, 20)
                    }
                }),
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}markFavouriteApartment/{apartmentId}`,
        handler: controller.markFavouriteApartment,
        options: {
            auth: 'jwt',
            plugins: { 'hapiAuthorization': { roles: ['USER'] } },
            description: 'Login as User and Mark an apartment as favourite',
            notes: 'Returns the db response after marking favourite ',
            tags: ['api'],
            validate: {
                headers: joi_1.default.object({
                    authorization: joi_1.default.string().required()
                }).options({ allowUnknown: true }),
                params: joi_1.default.object({
                    apartmentId: joi_1.default.string().min(8).max(40)
                })
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}listFavouriteApartments`,
        handler: controller.listFavouriteApartments,
        options: {
            auth: 'jwt',
            plugins: { 'hapiAuthorization': { roles: ['USER'] } },
            description: 'List all Favourite apartments',
            notes: 'Login as User and it returns all favourite apartments',
            tags: ['api'],
            validate: {
                headers: joi_1.default.object({
                    authorization: joi_1.default.string().required()
                }).options({ allowUnknown: true }),
            }
        }
    }
];
exports.default = apartmentRoutes;
