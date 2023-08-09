const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title required"]
        },
        summary: {
            type: String,
            required: [true, "Summary required"]
        },
        cover: {
            type: Array,
            required: true
        },
        description: {
            type: String,
            required: [true, "Description required"]
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

    },
    {
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

module.exports = Post;