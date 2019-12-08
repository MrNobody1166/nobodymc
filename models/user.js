var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    UserSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: "https://via.placeholder.com/150"
        },
        banner: {
            type: String,
            default: null
        },
        bio: {
            type: String,
            default: ""
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);