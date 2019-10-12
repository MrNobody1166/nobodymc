var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");

var userRoutes      = require("./routes/users"),
    blogRoutes      = require("./routes/blogs"),
    forumRoutes     = require("./routes/posts"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index");

mongoose.connect("mongodb://nobody:batmanwithfries12@ds113855.mlab.com:13855/nobodymc", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "batmaniscool",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use(async function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/blog/:id/comments", commentRoutes);
app.use("/user", userRoutes);
app.use("/blog", blogRoutes)
app.use("/forum", forumRoutes)
app.use("/", indexRoutes);

app.listen(3000, () => {
    console.log("Server is running successfully.");
});