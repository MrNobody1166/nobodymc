var middlewareObj   = {},
    Blog            = require("../models/blog"),
    Post            = require("../models/post"),
    Comment         = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash("error", "You Need To Be Logged In To Do That!");
    res.redirect("/user/login");
};

middlewareObj.isUserEqual = function(req, res, next) {
    if(req.isAuthenticated()) {
        if (req.user._id == req.params.id) {
            return next();
        } else {
            req.flash("error", "You Aren't Allowed To Do That!");
            res.redirect("/home");
        }
    } else {
        req.flash("error", "You Aren't Allowed To Do That!");
        res.redirect("/home");
    }
};

middlewareObj.isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin) {
            next();
        } else {
            req.flash("error", "Only members of NobodyMC can access this page.");
            
            return res.redirect("/home");
        };
    } else {
        res.redirect("/home");
    };
};

middlewareObj.checkBlogOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Blog.findById(req.params.id, function(err, blog) {
            if(err) {
                res.redirect("back");
                req.flash("error", "Blog Not Found");
                console.log(err + "\n ☻");
            } else {
                if(!blog) {
                    req.flash("error", "Blog Not Found.");
                    return res.redirect("back");
                };
                if(blog.author.id.equals(req.user._id) || req.user.isAdmin) { // You have to use .equals because one is an object and one is a string
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission To Do That!");
                    res.redirect("back");
                };
            };
        });
    } else {
        res.redirect("back");
    };
};

middlewareObj.checkPostOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Post.findById(req.params.id, function(err, post) {
            if(err) {
                res.redirect("back");
                req.flash("error", "Forum Post Not Found");
                console.log(err + "\n ☻");
            } else {
                if(!post) {
                    req.flash("error", "Forum Post Not Found.");
                    return res.redirect("back");
                };
                if(post.author.id.equals(req.user._id) || req.user.isAdmin) { // You have to use .equals because one is an object and one is a string
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission To Do That!");
                    res.redirect("back");
                };
            };
        });
    } else {
        res.redirect("back");
    };
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if(err) {
                res.redirect("back");
                req.flash("error", "Comment Not Found");
                console.log(err + "\n ☻");
            } else {
                if(!comment) {
                    req.flash("error", "Comment Not Found.");
                    return res.redirect("back");
                };
                if(comment.author.id.equals(req.user._id) || req.user.isAdmin) { // You have to use .equals because one is an object and one is a string
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission To Do That!");
                    res.redirect("back");
                };
            };
        });
    } else {
        res.redirect("back");
    };
};

module.exports = middlewareObj;