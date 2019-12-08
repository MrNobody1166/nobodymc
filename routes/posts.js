var express         = require("express"),
    // eslint-disable-next-line new-cap
    router          = express.Router(),
    Post            = require("../models/post"),
    Reply           = require("../models/reply"),
    // eslint-disable-next-line no-unused-vars
    User            = require("../models/user"),
    middleware      = require("../middleware"),
    // eslint-disable-next-line no-unused-vars
    passport        = require("passport");

router.post("/:id/replies/", middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (postErr, post) => {
        if (postErr) {
            console.log(postErr + "\n ☻");
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("back");
        } else {
            // eslint-disable-next-line max-statements
            Reply.create(req.body.reply, (replyErr, reply) => {
                if (replyErr) {
                    console.log(replyErr + "\n ☻");
                    req.flash("error", "Something Went Wrong! Please Try Again.");
                    // eslint-disable-next-line no-underscore-dangle
                    res.redirect("/forum/" + post._id + "/new")
                } else {
                    // eslint-disable-next-line no-underscore-dangle
                    reply.author.id = req.user._id;
                    reply.author.username = req.user.username;
                    reply.save();
                    post.replys.push(reply);
                    post.save();
                    req.flash("success", "Successfully Created New Reply!");
                    // eslint-disable-next-line no-underscore-dangle
                    res.redirect("/forum/" + post._id);
                }
            });
        }
    });
});

router.post("/:id/replies/:reply_id/edit", middleware.checkReplyOwnership, (req, res) => {
    // eslint-disable-next-line no-unused-vars
    Reply.findByIdAndUpdate(req.params.reply_id, req.body.reply, (err, _reply) => {
        if (err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("back");
        } else {
            req.flash("success", "Succesfully Edited Reply");
            res.redirect("/forum/" + req.params.id);
        }
    });
});

router.post("/:id/replies/:reply_id/delete", middleware.checkReplyOwnership, (req, res) => {
    Reply.findByIdAndDelete(req.params.reply_id, (err) => {
        if (err) {
            res.redirect("back");
            req.flash("error", "Something Went Wrong! Please Try Again.");
            console.log(err + "\n ☻");
        } else {
            req.flash("success", "Successfully Deleted Reply");
            res.redirect("back")
        }
    });
});

// **************************************************************************************

router.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            console.log(err);
            req.flash("error", `An error has occurred: ${err.message}`);
            res.redirect("/");
        } else {
            res.render("forum/forum", {posts});
        }
    });
});

router.get("/new", middleware.isLoggedIn, (_req, res) => {
    res.render("forum/new");
});

router.post("/new", middleware.isLoggedIn, async function(req, res) {
    var {title} = req.body,
        {description} = req.body,
        author = {
            // eslint-disable-next-line no-underscore-dangle
            id: req.user._id,
            username: req.user.username
        },
        post = {
            title,
            description,
            author
        };

    // eslint-disable-next-line no-unused-vars
    Post.create(post, function(err, _post) {
        if (err) {
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
    Post.findById(req.params.id).populate("replies").
        exec((err, post) => {
            if (err) {
                console.log(err);
                req.flash("error", `An error has occurred: ${err.message}`);
                res.redirect("/forum");
            } else {
                res.render("forum/show", {post});
            }
        });
});

router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went Wrong! Please Try Again.");
            res.redirect("back");
        } else {
            res.render("forum/edit", {post});
        }
    });
});

router.put("/:id", middleware.checkPostOwnership, (req, res) => {
    // eslint-disable-next-line no-unused-vars
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, _post) => {
        if (err) {
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
    Post.findById(req.params.id, (postErr, post) => {
        if (postErr) {
            res.redirect("/forum");
        } else {
            Reply.remove({"_id": {$in: post.replies}}, (replyErr) => {
                if (replyErr) {
                    console.log(replyErr);

                    return res.redirect("/forum");
                }
                post.remove();
                req.flash("success", "Forum Post Deleted Successfully!");

                return res.redirect("/forum");
            });
        }
    });
});


module.exports = router;