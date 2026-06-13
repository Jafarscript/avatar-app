import mongoose from "mongoose";

const User = new mongoose.Schema({
    userName: {type: String, required: true, unique: true, lowercase: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    displayName: {type: String, required: true},
    bio: {type: String, default: ""},
    avatar: {type: String, default: ""}
}, {timestamps: true})

export default mongoose.model("User", User)