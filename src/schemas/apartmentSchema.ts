import { Schema } from "mongoose";
import * as mongoose from "mongoose";

const schema = new Schema({
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
export const apartmentSchema = mongoose.model('Apartment', schema);
