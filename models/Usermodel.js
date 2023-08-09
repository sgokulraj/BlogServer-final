const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'name is required'],
        minLength: [5, "Enter atleast 5 characters"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Enter atleast 6 characters"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    posts: [{
        type: Schema.Types.ObjectId, ref: "Post"
    }]
}, { minimize: false });

const User = model("User", userSchema);
module.exports = User