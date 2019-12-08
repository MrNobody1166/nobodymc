var mongoose = require("mongoose");
// eslint-disable-next-line no-unused-vars
var Reply = require("./reply"),

    postSchema = new mongoose.Schema({
        title: String,
        description: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reply"
            }
        ]
    });

module.exports = mongoose.model("Post", postSchema);