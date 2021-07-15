import { Request, ResponseToolkit } from "@hapi/hapi";
import { apartmentSchema } from "../schemas/apartmentSchema";
import Logger from "../utils/logger";



export class apartmentController {

    searchApartment (request: Request, h: ResponseToolkit): string {
        Logger.info(request.payload);
        return `Helloe world                                !`;
    }

    async createApartment (request: Request, h: ResponseToolkit): Promise<any> {
        const apartment = new apartmentSchema(request.payload)
        try {
            const result = await apartment.save();
            Logger.info("new apartment registered")
            return result;
        }
        catch (e) {
            Logger.error(e)
            return e;
        }
    }

    markFavouriteApartment (request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

    listFavouriteApartments (request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

}