import { Schema } from 'mongoose';

export var heroSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    name: String
});