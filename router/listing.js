const express = require('express');
const Listing = require('../models/Listing');
const ExpressError = require('../Utils/ExpressError');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isOwner} = require('../authenticate');

// Route to show the new listing form
router.get('/new', isLoggedIn,  (req, res) => {  // Changed the path here
    res.render('listings/new.ejs');  // Make sure the path is correct
});

// Create Route
router.post('/new', isLoggedIn, async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "Post Uploaded Successfully!");
        res.redirect('/home');
    } catch (error) {
        next(error);
    }
});

// Edit Route
router.get('/edit/:id', isLoggedIn, isOwner, async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render('listings/update.ejs', { listing });  // Make sure the path is correct
    } catch (err) {
        next(err);
    }
});

// Update Route
router.put('/edit/:id', isLoggedIn, isOwner, async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Post Updated Successfully!");
        res.redirect('/home');
    } catch (e) {
        console.log(e);
    }
});

// Delete Route
router.delete('/delete/:id', isLoggedIn, isOwner, async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Post Deleted Successfully!");
        res.redirect('/home');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
