var mongoose = require("mongoose"),
    replySchema = new mongoose.Schema({
        text: String,
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
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        }
    });

module.exports = mongoose.model("Reply", replySchema);