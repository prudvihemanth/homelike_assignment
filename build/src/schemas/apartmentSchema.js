"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apartmentSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose = __importStar(require("mongoose"));
const schema = new mongoose_1.Schema({
    location: {
        apartmentNumber: { type: String, required: true },
        streetName: { type: String, required: true },
        town: { type: String },
        zipcode: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    geoLocation: {
        type: { type: String },
        coordinates: []
    },
    details: {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true }
    },
    layout: {
        noOfRooms: { type: Number, default: null },
        noOfBedrooms: { type: Number, default: null },
        isDining: { type: Boolean, default: null },
        isKitchen: { type: Boolean, default: null }
    },
    apartmentStructure: {
        floorNo: { type: Number, default: null },
        areaSqMts: { type: Number, default: null }
    },
    amenities: {
        general: {
            isWashing: { type: Boolean, default: null },
            isHeating: { type: Boolean, default: null }
        },
        additional: {
            isCoffeeMachine: { type: Boolean, default: null },
            isToaster: { type: Boolean, default: null }
        }
    },
    pricing: {
        rentInEuro: { type: Number, required: true },
        depositMonths: { type: Number, required: true }
    }
});
schema.index({ geoLocation: "2dsphere" });
exports.apartmentSchema = mongoose.model('Apartment', schema);
