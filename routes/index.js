var express         = require("express"),
    router          = express.Router(),
    User            = require("../models/user"),
    Blog            = require("../models/blog"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware"),
    passport        = require("passport");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/home", (req, res) => {
    res.render("main/home");
});

router.get("/about", (req, res) => {
    res.render("main/about");
});

router.get("/members", (req, res) => {
    res.render("main/members");
});

router.get("/resources", (req, res) => {
    res.render("main/resources");
});

router.get("/error", (req, res) => {
    res.render("main/error", {msg: null, prev: null});
});

module.exports = router;