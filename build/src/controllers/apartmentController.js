"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apartmentController = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const apartmentSchema_1 = require("../schemas/apartmentSchema");
const userSchema_1 = require("../schemas/userSchema");
const logger_1 = __importDefault(require("../utils/logger"));
class apartmentController {
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
    searchApartment(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let latitude = null;
            let longitude = null;
            let query = {};
            let geoLocationFilter = {};
            const noOfRoomsFilter = { 'layout.noOfRooms': request.payload.filter.noOfRooms };
            const cityFilter = { 'location.city': request.payload.location.city };
            const countryFilter = { 'location.country': request.payload.location.country };
            if (request.payload.location.address) {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.payload.location.address}&key=AIzaSyD1i4morv3Sw2Y2DeGi1PIEk6tV4oUw6Ao`;
                yield node_fetch_1.default(url)
                    .then(res => res.json())
                    .then(json => {
                    if (json.results[0]) { // if address has geo coordinates
                        logger_1.default.info(`Successfully converted address to coordinates for address ${request.payload.location.address}`);
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
                        };
                    }
                    else { // if address dont have geo coordinates
                        logger_1.default.warn(`Failure converting address to coordinates for address ${request.payload.location.address}`);
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
                        };
                    }
                });
            }
            // only city
            if (request.payload.location.city && !request.payload.location.country && !request.payload.location.address) {
                query = {
                    $and: [cityFilter, noOfRoomsFilter]
                };
            }
            //only country
            else if (!request.payload.location.city && request.payload.location.country && !request.payload.location.address) {
                query = {
                    $and: [countryFilter, noOfRoomsFilter]
                };
            }
            // only address
            else if (!request.payload.location.city && !request.payload.location.country && request.payload.location.address) {
                query = {
                    $and: [noOfRoomsFilter, geoLocationFilter]
                };
            }
            // city, country, address
            else if (request.payload.location.city && request.payload.location.country && request.payload.location.address) {
                query = {
                    $and: [cityFilter, countryFilter, noOfRoomsFilter, geoLocationFilter]
                };
            }
            //city, country without address
            else if (request.payload.location.city && request.payload.location.country && !request.payload.location.address) {
                query = { $and: [cityFilter, countryFilter, noOfRoomsFilter] };
            }
            //city and address
            else if (request.payload.location.city && !request.payload.location.country && request.payload.location.address) {
                query = { $and: [cityFilter, noOfRoomsFilter, geoLocationFilter] };
            }
            //country and address
            else if (!request.payload.location.city && request.payload.location.country && request.payload.location.address) {
                query = {
                    $and: [countryFilter, noOfRoomsFilter, geoLocationFilter]
                };
            }
            try {
                const apartments = yield apartmentSchema_1.apartmentSchema.find(query);
                return apartments;
            }
            catch (e) {
                logger_1.default.error(`error fetching apartments ${e.message}`);
                return e;
            }
        });
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
    createApartment(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let location = "";
            if (request.payload.town) {
                location = `${request.payload.location.apartmentNo}+${request.payload.location.streetName}+${request.payload.location.town}+${request.payload.location.city}+${request.payload.location.country}+${request.payload.location.zipcode}`;
            }
            else {
                location = `${request.payload.location.apartmentNo}+${request.payload.location.streetName}+${request.payload.location.city}+${request.payload.location.country}+${request.payload.location.zipcode}`;
            }
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBrhdUEKForI3CQa_sGeVkhCbbIWaswKA4`;
            const geoLocation = yield node_fetch_1.default(url)
                .then(res => res.json())
                .then(json => {
                request.payload.geoLocation = { type: null, coordinates: [] };
                if (json.results[0]) {
                    request.payload.geoLocation.type = "Point";
                    request.payload.geoLocation.coordinates = [json.results[0].geometry.location.lng, json.results[0].geometry.location.lat];
                }
            });
            const apartment = new apartmentSchema_1.apartmentSchema(request.payload);
            try {
                const result = yield apartment.save();
                logger_1.default.info("new apartment registered");
                return h.response(result).code(201);
            }
            catch (e) {
                logger_1.default.error(e);
                return e;
            }
        });
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
    markFavouriteApartment(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userSchema_1.userSchema.updateOne({ _id: request.context._id }, { $push: { favouriteApartments: request.params.apartmentId } });
                logger_1.default.info(result);
                return result;
            }
            catch (e) {
                logger_1.default.error(e);
                return e;
            }
        });
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
    listFavouriteApartments(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userSchema_1.userSchema.find(request.context._id).populate('favouriteApartments');
                if (user[0])
                    return user[0].favouriteApartments;
            }
            catch (e) {
                return e;
            }
        });
    }
}
exports.apartmentController = apartmentController;
