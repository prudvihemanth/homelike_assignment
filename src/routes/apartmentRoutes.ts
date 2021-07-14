import Joi from "joi";

import { apartmentController } from "../controllers/apartmentController";


const controller = new apartmentController();
const basePath: string = "/api/v1/";


const apartmentRoutes = [
    {
        method: 'POST',
        path: `${basePath}createApartment`,
        handler: controller.searchApartment,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
            validate: {
                payload: Joi.object({
                    location: {
                        city: Joi.string().min(3).max(10),
                        country: Joi.string().min(3).max(10)
                    },
                    details: {
                        title: Joi.string().min(5).max(30).required(),
                        description: Joi.string().min(10).max(200).required(),
                    },
                    layout: {
                        noOfBedrooms: Joi.number().min(1).max(10).required(),
                        isDining: Joi.boolean(),
                        isKitchen: Joi.boolean()
                    },
                    apartmentStructure: {
                        floorNo: Joi.number().min(0).max(100).required(),
                        areaSqMts: Joi.number().min(100).max(2000).required()
                    },
                    amenities: {
                        general: {
                            isWashing: Joi.boolean(),
                            isHeating: Joi.boolean(),

                        },
                        additional: {
                            isCoffeeMachine: Joi.boolean(),
                            isToaster: Joi.boolean()
                        }
                    },
                    pricing: {
                        rentInEur0: Joi.number().min(100).max(5000),
                        depositMonths: Joi.number().min(0).max(12),

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
            tags: ['api'], // ADD THIS TAG
            validate: {
                payload: Joi.object({
                    location: {
                        city: Joi.string().min(3).max(10),
                        country: Joi.string().min(3).max(10)
                    },
                    filters: {
                        totalRooms: Joi.number().min(1).max(15),
                        nearestToKms: Joi.allow(10, 20)
                    },
                    geoLocation: {
                        address: Joi.string().min(3).max(10)
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
            tags: ['api'], // ADD THIS TAG
            validate: {
                params: Joi.object({
                    apartmentId: Joi.string().min(8).max(20)
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
            tags: ['api'], // ADD THIS TAG
            validate: {
                query: Joi.object({
                    limit: Joi.number().integer().min(1).max(100).default(10)
                })
            }
        }
    }]


export default apartmentRoutes;
