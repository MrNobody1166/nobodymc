var express         = require("express"),
    router          = express.Router({mergeParams: true}),
    Blog      = require("../models/blog"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");

router.post("/", middleware.isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err) {
            console.log(err + "\n ☻");
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err + "\n ☻");
                    req.flash("error", "Something Went Wrong! Please Try Again.");
                    res.redirect("/blog/" + blog._id + "/new")
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    req.flash("success", "Successfully Created New Comment!");
                    res.redirect("/blog/" + blog._id);
                }
            });
        }
    });
});

router.post("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if(err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("back");
        } else {
            req.flash("success", "Succesfully Edited Comment");
            res.redirect("/blog/" + req.params.id);
        }
    });
});

router.post("/:comment_id/delete", middleware.checkCommentOwnership, (req, res) => {
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

module.exports = router;