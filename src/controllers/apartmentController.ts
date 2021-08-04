import { ResponseToolkit } from "@hapi/hapi";
import fetch from "node-fetch";

import { apartmentSchema } from "../schemas/apartmentSchema";
import { userSchema } from "../schemas/userSchema";

import Logger from "../utils/logger";


export class apartmentController {

   /**
   * Search for Apartments.
   *
   * @remarks
   * This method is part of Apartment registration and searching.
   *
   * @param request - Payload object should contain parameters like city, country, address and filters like number of rooms.
   * @returns The array of apartments matching the search query
   *
   */

    async searchApartment(request: any, h: ResponseToolkit): Promise<any> {

        let latitude = null;
        let longitude = null;
        let query = {};
        let geoLocationFilter = {};
        const noOfRoomsFilter = { 'layout.noOfRooms': request.payload.filter.noOfRooms };
        const cityFilter = {'location.city': request.payload.location.city};
        const countryFilter = {'location.country': request.payload.location.country};

        if (request.payload.location.address) {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.payload.location.address}&key=AIzaSyD1i4morv3Sw2Y2DeGi1PIEk6tV4oUw6Ao`;
            await fetch(url)
                .then(res => res.json())
                .then(json => {
                    if (json.results[0]) { // if address has geo coordinates
                        Logger.info(`Successfully converted address to coordinates for address ${request.payload.location.address}`)
                        latitude = json.results[0].geometry.location.lat;
                        longitude = json.results[0].geometry.location.lng;
                        geoLocationFilter = {
                            geoLocation: {
                                $near: {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [longitude, latitude]
                                    },
                                    $maxDistance: (request.payload.filter.nearestToKms) / 1000,
                                    $minDistance: 0
                                }
                            }
                        }
                    }

                    else { // if address dont have geo coordinates
                        Logger.warn(`Failure converting address to coordinates for address ${request.payload.location.address}`)
                        geoLocationFilter = {
                            geoLocation: {
                                $near: {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [0, 0]
                                    },
                                    $maxDistance: (request.payload.filter.nearestToKms) / 1000,
                                    $minDistance: 0
                                }
                            }
                        }

                    }

                });
        }
       

        // only city
        if (request.payload.location.city && !request.payload.location.country && !request.payload.location.address) {
            query = {
                $and: [cityFilter, noOfRoomsFilter]
            }
        }

        //only country
        else if (!request.payload.location.city && request.payload.location.country && !request.payload.location.address) {
            query = {
                $and: [countryFilter, noOfRoomsFilter]
            }
        }

        // only address
        else if (!request.payload.location.city && !request.payload.location.country && request.payload.location.address) {
            query = {
                $and: [noOfRoomsFilter, geoLocationFilter]
            }
        }

        // city, country, address
        else if (request.payload.location.city && request.payload.location.country && request.payload.location.address) {
            query = {
                $and: [cityFilter,countryFilter,noOfRoomsFilter, geoLocationFilter]
            }

        }
        //city, country without address
        else if (request.payload.location.city && request.payload.location.country && !request.payload.location.address) {
            query = { $and: [cityFilter, countryFilter, noOfRoomsFilter] }
        }

        //city and address
        else if (request.payload.location.city && !request.payload.location.country && request.payload.location.address) {
            query = { $and: [cityFilter, noOfRoomsFilter, geoLocationFilter] }
        }

        //country and address
        else if (!request.payload.location.city && request.payload.location.country && request.payload.location.address) {
            query = {
                $and: [countryFilter, noOfRoomsFilter, geoLocationFilter]
            }
        }
        try {
            const apartments = await apartmentSchema.find(query);
            return apartments;
        }
        catch (e: any) {
            Logger.error(`error fetching apartments ${e.message}`)
            return e
        }

    }

   /**
   * Login as Tenanat & Create an apartment.
   *
   * @remarks
   * This method is part of Apartment registration and searching.
   *
   * @param request - Payload object should apartment details like location, amenities, price etc.
   * @returns The aprtment object saved in database
   *
   */

    async createApartment(request: any, h: ResponseToolkit): Promise<any> {
        let location = "";
        if (request.payload.town) {
            location = `${request.payload.location.apartmentNo}+${request.payload.location.streetName}+${request.payload.location.town}+${request.payload.location.city}+${request.payload.location.country}+${request.payload.location.zipcode}`
        }
        else {
            location = `${request.payload.location.apartmentNo}+${request.payload.location.streetName}+${request.payload.location.city}+${request.payload.location.country}+${request.payload.location.zipcode}`
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBrhdUEKForI3CQa_sGeVkhCbbIWaswKA4`;

        const geoLocation = await fetch(url)
            .then(res => res.json())
            .then(json => {
                request.payload.geoLocation = {type: null, coordinates: []};
                if (json.results[0]) {
                    request.payload.geoLocation.type =  "Point";
                    request.payload.geoLocation.coordinates = [json.results[0].geometry.location.lng, json.results[0].geometry.location.lat]
                }
            });

        const apartment = new apartmentSchema(request.payload);

        try {
            const result = await apartment.save();
            Logger.info("new apartment registered")
           return h.response(result).code(201);
        }
        catch (e) {
            Logger.error(e)
            return e;
        }
    }

    
   /**
   * Login as User & Mark apartment as favourite.
   *
   * @remarks
   * This method is part of Apartment registration and searching.
   *
   * @param request - Request params should contain apartment Id
   * @returns Returns success object from db
   *
   */
    async markFavouriteApartment(request: any, h: ResponseToolkit): Promise<any> {
        try {
            const result = await userSchema.updateOne({ _id: request.context._id },
                { $push: { favouriteApartments: request.params.apartmentId } });
            Logger.info(result);
            return result;
        }
        catch (e) {
            Logger.error(e)
            return e;
        }
    }

   /**
   * Login as User & List all favourite apartments.
   *
   * @remarks
   * This method is part of Apartment registration and searching.
   *
   * @param request - Request Headers should contain autherization token 
   * @returns Populates array of favourite apartments for the user
   *
   */

    async listFavouriteApartments(request: any, h: ResponseToolkit): Promise<any> {
        try {
            const user = await userSchema.find(request.context._id).populate('favouriteApartments');
            if (user[0])
                return user[0].favouriteApartments;
        }
        catch (e) {
            return e;
        }
    }

}