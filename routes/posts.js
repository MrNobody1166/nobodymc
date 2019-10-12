var express         = require("express"),
    router          = express.Router(),
    Post           = require("../models/post"),
    Comment         = require("../models/comment"),
    User            = require("../models/user"),
    middleware      = require("../middleware"),
    passport        = require("passport");

router.post("/:id/comments/", middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if(err) {
            console.log(err + "\n ☻");
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err + "\n ☻");
                    req.flash("error", "Something Went Wrong! Please Try Again.");
                    res.redirect("/forum/" + post._id + "/new")
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("success", "Successfully Created New Comment!");
                    res.redirect("/forum/" + post._id);
                }
            });
        }
    });
});

router.post("/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("back");
        } else {
            req.flash("success", "Succesfully Edited Comment");
            res.redirect("/forum/" + req.params.id);
        }
    });
});

router.post("/:id/comments/:comment_id/delete", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if(err) {
            res.redirect("back");
            req.flash("error", "Something Went Wrong! Please Try Again.");
            console.log(err + "\n ☻");
        } else {
            req.flash("success", "Successfully Deleted Comment");
            res.redirect("back")
        }
    });
});

// **************************************************************************************

router.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/");
        } else {
            res.render("forum/forum", {posts: posts});
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("forum/new");
});

router.post("/new", middleware.isLoggedIn, async function(req, res) {
    var title = req.body.title,
        description = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        },
        post = {title: title, description: description, author: author};
    Post.create(post, function(err, post) {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/forum");
        } else {
            req.flash("success", "Successfully Created New Forum Post!");
            res.redirect("/forum");
        }
    });
});

router.get("/:id", (req, res) => {
    Post.findById(req.params.id).populate("comments").exec((err, post) => {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/forum");
        } else {
            res.render("forum/show", {post: post});
        }
    });
});

router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if(err) {
            console.log(err);
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("back");
        } else {
            res.render("forum/edit", {post: post});
        }
    });
});

router.put("/:id", middleware.checkPostOwnership, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
        if(err) {
            console.log(err);
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("/forum");
        } else {
            req.flash("success", "Successfully Edited Forum Post!");
            res.redirect("/forum/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            res.redirect("/forum");
        } else {
            Comment.remove({"_id": {$in: post.comments}}, (err) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/forum");
                }
                post.remove();
                req.flash("success", "Forum Post Deleted Successfully!");
                res.redirect("/forum");
            });
        }
    });
});



module.exports = router;