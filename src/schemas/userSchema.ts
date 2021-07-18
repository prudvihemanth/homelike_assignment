import { Schema } from "mongoose";
import * as mongoose from "mongoose";

const schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: {
        type: String, required: true
    },
    isActive: { type: Boolean, default: true },
    created_date: { type: Date, default: Date.now },
    role: { type: String, required: true, enum: ['USER', 'TENANT'] },
    favouriteApartments: [{ type: Schema.Types.ObjectId, ref: 'Apartment', unique: true }],

});

schema.index({ email: 1 }, { unique: true })

export const userSchema = mongoose.model('User', schema);
