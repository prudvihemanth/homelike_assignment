import { Request, ResponseToolkit } from "@hapi/hapi";

export class apartmentController {

    searchApartment (request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

    createApartment (request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

    markFavouriteApartment (request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

    listFavouriteApartments (request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

}