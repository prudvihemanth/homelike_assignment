import Joi from "joi";

import { apartmentController } from "../controllers/apartmentController";

const controller = new apartmentController();
const basePath: string = "/api/v1/";


const apartmentRoutes = [
    {
        method: 'POST',
        path: `${basePath}createApartment`,
        handler: controller.createApartment,
        options: {
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles: ['TENANT']}},
            description: 'Create an Apartment',
            notes: 'Login as Tenant and create an apartment, response is the apartment object.',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required()
                }).options({ allowUnknown: true }),
                payload: Joi.object({
                    location: {
                       apartmentNumber: Joi.number().min(0).max(1000000),
                       streetName: Joi.string().min(2).max(300).required(),
                       town: Joi.string().min(2).max(300).optional(),
                       zipcode: Joi.number().min(2).max(1000000).required(),
                       city: Joi.string().min(2).max(300).required(),
                       country: Joi.string().min(2).max(30).required()
                   },
                    details: {
                        title: Joi.string().min(3).max(30).required(),
                        description: Joi.string().min(3).max(200).required(),
                    },
                    layout: {
                        noOfRooms: Joi.number().min(1).max(20),
                        noOfBedrooms: Joi.number().min(1).max(10),
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
                        rentInEuro: Joi.number().min(100).max(5000).required(),
                        depositMonths: Joi.number().min(0).max(12).required(),
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
            plugins: {'hapiAuthorization': {roles: ['TENANT', 'USER']}},
            description: 'Search for apartments',
            notes: 'Get all nearby apartments by passing filters like city, country, no of rooms etc. Returns array of apartments',
            tags: ['api'], 
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required()
                }).options({ allowUnknown: true }),
                payload: Joi.object({
                    location: {
                       address: Joi.string().min(2).max(300).allow(''),
                       city: Joi.string().min(2).max(300).allow(''),
                       country: Joi.string().min(2).max(30).allow('')
                   },
                   filter: {
                    noOfRooms: Joi.number().min(1).max(20).required(), 
                    nearestToKms: Joi.allow(10,20)
                   }}),
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}markFavouriteApartment/{apartmentId}`,
        handler: controller.markFavouriteApartment,
        options: {
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles: ['USER']}},
            description: 'Login as User and Mark an apartment as favourite',
            notes: 'Returns the db response after marking favourite ',
            tags: ['api'], 
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required()
                }).options({ allowUnknown: true }),
                params: Joi.object({
                    apartmentId: Joi.string().min(8).max(40)
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
            plugins: {'hapiAuthorization': {roles: ['USER']}},
            description: 'List all Favourite apartments',
            notes: 'Login as User and it returns all favourite apartments',
            tags: ['api'], 
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required()
                }).options({ allowUnknown: true }),
             
            }
        }
    }]


export default apartmentRoutes;
