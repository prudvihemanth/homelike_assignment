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
        handler: controller.searchApartment,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                payload: joi_1.default.object({
                    location: {
                        city: joi_1.default.string().min(3).max(10),
                        country: joi_1.default.string().min(3).max(10)
                    },
                    details: {
                        title: joi_1.default.string().min(5).max(30).required(),
                        description: joi_1.default.string().min(10).max(200).required(),
                    },
                    layout: {
                        noOfBedrooms: joi_1.default.number().min(1).max(10).required(),
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
                        rentInEur0: joi_1.default.number().min(100).max(5000),
                        depositMonths: joi_1.default.number().min(0).max(12),
                    }
                })
            }
        }
    },
    {
        method: 'POST',
        path: `${basePath}searchApartment/{name}`,
        handler: controller.searchApartment,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                payload: joi_1.default.object({
                    location: {
                        city: joi_1.default.string().min(3).max(10),
                        country: joi_1.default.string().min(3).max(10)
                    },
                    filters: {
                        totalRooms: joi_1.default.number().min(1).max(15),
                        nearestToKms: joi_1.default.allow(10, 20)
                    },
                    geoLocation: {
                        address: joi_1.default.string().min(3).max(10)
                    }
                })
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}markFavouriteApartment/{apartmentId}`,
        handler: controller.markFavouriteApartment,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                params: joi_1.default.object({
                    apartmentId: joi_1.default.string().min(8).max(20)
                })
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}listFavouriteApartments`,
        handler: controller.searchApartment,
        options: {
            auth: false,
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                query: joi_1.default.object({
                    limit: joi_1.default.number().integer().min(1).max(100).default(10)
                })
            }
        }
    }
];
exports.default = apartmentRoutes;
