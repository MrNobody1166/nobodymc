var express         = require("express"),
    router          = express.Router(),
    Blog            = require("../models/blog"),
    Comment         = require("../models/comment"),
    User            = require("../models/user"),
    middleware      = require("../middleware"),
    passport        = require("passport");

router.get("/", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/");
        } else {
            res.render("blogs/blog", {blogs: blogs});
        }
    });
});

router.get("/new", (req, res) => {
    res.render("blogs/new");
});

router.post("/new", middleware.isAdmin, async function(req, res) {
    var title = req.body.title,
        image = req.body.image,
        desc = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        },
        blog = {title: title, image: image, description: desc, author: author};
    Blog.create(blog, function(err, blog) {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/blog");
        } else {
            req.flash("success", "Successfully Created New Blog Post!");
            res.redirect("/blog");
        }
    });
});

router.get("/:id", (req, res) => {
    Blog.findById(req.params.id).populate("comments").exec((err, blog) => {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/blog");
        } else {
            res.render("blogs/show", {blog: blog});
        }
    });
});

router.get("/:id/edit", middleware.checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err) {
            console.log(err);
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("back");
        } else {
            res.render("blogs/edit", {blog: blog});
        }
    });
});

router.put("/:id", middleware.checkBlogOwnership, (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
        if(err) {
            console.log(err);
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("/blog");
        } else {
            req.flash("success", "Successfully Edited Blog!");
            res.redirect("/blog/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect("/blog");
        } else {
            Comment.remove({"_id": {$in: blog.comments}}, (err) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/blog");
                }
                blog.remove();
                req.flash("success", "blog deleted successfully!");
                res.redirect("/blog");
            });
        }
    });
});



module.exports = router;