// const express = require('express');
// const flash = require('connect-flash');
// const session = require('express-session');
// const passport = require('passport');

const Listing = require("./models/Listing");
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req);
    console.log(req.originalUrl)
    if(!req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl  // post login page redirect
       req.flash("error", "you are not loggedIn!");
       return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    
}

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){ 
        req.flash("error", "You are not the owner of this post");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


module.exports.isAuthor = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){ 
        req.flash("error", "You are not the owner of this post");
        return res.redirect(`/listing/${id}`);
    }
    next();
}



// module.exports = isLoggedIn;
// module.exports = saveRedirectUrl;