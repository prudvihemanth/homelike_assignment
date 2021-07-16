import { Request, ResponseToolkit } from "@hapi/hapi";
import { apartmentSchema } from "../schemas/apartmentSchema";
import { userSchema } from "../schemas/userSchema";
import { ObjectId } from "mongoose";


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

  async  markFavouriteApartment (request: any, h: ResponseToolkit): Promise<any> {
        try {
            const result = await userSchema.updateOne({ _id: "60f024179f53e49e9f61659a"}, 
                { $push: { favouriteApartments: "60effc36957e08d97bc1168c"} });
            Logger.info(result);
            return result;
        }
        catch (e) {
            Logger.error(e)
            return e;
        }
    }

  async  listFavouriteApartments (request: Request, h: ResponseToolkit):  Promise<any> {
    try{
        const user = await userSchema.find({ _id: "60f024179f53e49e9f61659a"}).populate('favouriteApartments');
        if(user[0])
        return user[0].favouriteApartments;
       }
       catch(e) {
           return e;
       }
    }    

}