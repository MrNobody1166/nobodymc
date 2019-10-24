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
    User.findById(req.params.id, (err, user) => {
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
                    if(posts) {
                        res.render("users/show", {user: user, posts: posts});
                    } else {
                        res.render("users/show", {user: user, posts: null});
                    }
                }
            });
        }
    });
});

router.post("/:id/banner", middleware.isUserEqual, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.banner, (err, user) => {
        if(err) {
            console.log(`${req.body.banner}\n\n${err.message}\n\n${err}`);
            req.flash(`error", "Something went wrong! ${err.message}`);
            res.redirect("/:id");
        } else {
            req.flash("success", "Successfully Edited Banner!");
            res.redirect("/user/" + req.params.id);
            //     user.banner = req.body.banner;
            //     user.save;
            // } else {
            //     req.flash("error", "You're not allowed to do that");
            //     res.redirect("/:id");
            // }
        }
    });
});

module.exports = router;