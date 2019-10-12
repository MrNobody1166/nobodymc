var express         = require("express"),
    router          = express.Router(),
    User            = require("../models/user"),
    Blog            = require("../models/blog"),
    Post            = require("../models/post"),
    middleware      = require("../middleware"),
    passport        = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === "1166clan") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err.message);
            req.flash("error", `Something went wrong! ${err.message}`);
            return res.redirect("/user/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to the NobodyMC website" + user.username + "!");
                res.redirect("/home");
            });
        }
    });
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/user/login"
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You were logged out successfully!");
    res.redirect("/home");
});

router.get("/:id", async function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            console.log(err);
            req.flash("error", `Something went wrong! ${err.message}`);
            res.redirect("/home");
        } else {
            Post.find().where("author.id").equals(user.id).exec(function(err, posts) {
                if(err){
                    console.log(err);
                    req.flash("error", "Something Went Wrong! Please Try Again")
                    res.redirect("/home");
                } else {
                    res.render("users/show", {user: user, posts: posts});
                }
            });
            res.render("users/show", {user: user});
        }
    });
});

module.exports = router;