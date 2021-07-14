import { Schema, ObjectId } from "mongoose";

export const userSchema = new Schema({

    firstName: {type: String},
    lastName: String,
    email: String,
    password: { type: String, required: true },
    isActive: Boolean,
    created_date: { type: Date, default: Date.now },
  //  favouriteApartments: [{ type : ObjectId, ref: 'User' }], 
    
});

userSchema.index({ email: 1}, { unique: true })

// firstname
// lastname
// email
// password
// created_date
// favourate_apartments
// isactive

//register (202), return all users (200), login (200), mark favourite (), list all favourite apartments ()