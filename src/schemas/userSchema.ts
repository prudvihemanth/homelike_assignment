import { Schema, ObjectId } from "mongoose";
import * as mongoose from "mongoose";

const schema = new Schema({

    firstName: {type: String},
    lastName: {type: String},
    email: { type: String, required: true },
    password: { type: String, required: true },
    isActive: {type: Boolean, default: true},
    created_date: { type: Date, default: Date.now },
  //  favouriteApartments: [{ type : ObjectId, ref: 'User' }], 
    
});

schema.index({ email: 1}, { unique: true })

export const userSchema = mongoose.model('User', schema);

//register (202), return all users (200), login (200), mark favourite (), list all favourite apartments ()