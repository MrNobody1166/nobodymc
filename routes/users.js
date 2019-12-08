var express         = require("express"),
    // eslint-disable-next-line new-cap
    router          = express.Router(),
    User            = require("../models/user"),
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
        email: req.body.email
    });

    // eslint-disable-next-line no-process-env
    if (req.body.adminCode === process.env.ADMIN) {
        newUser.isAdmin = true;
    }
    // eslint-disable-next-line consistent-return
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err.message);
            req.flash("error", `Something went wrong! ${err.message}`);

            return res.redirect("/user/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to the NobodyMC website" + user.username + "!");
            res.redirect("/home");
        });

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

module.exports = router;