import { Schema, ObjectId } from "mongoose";
import * as mongoose from "mongoose";

const schema = new Schema({
        location: {
          city: { type: String, required: true },
          country: { type: String, required: true }
        },
        details: {
          title: { type: String, required: true, unique: true },
          description: { type: String, required: true }
        },
        layout: {
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


export const apartmentSchema = mongoose.model('Apartment', schema);

//register (202), return all users (200), login (200), mark favourite (), list all favourite apartments () 