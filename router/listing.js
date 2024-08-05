const express = require('express');
const Listing = require('../models/Listing');
const ExpressError = require('../Utils/ExpressError');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isOwner} = require('../authenticate');
const multer = require('multer');
const {storage} = require('../Cloudconfig');
const upload = multer({storage});



// Route to show the new listing form
router.get('/new', isLoggedIn,  (req, res) => {  // Changed the path here
    res.render('listings/new.ejs');  // Make sure the path is correct
});


// Show route
router.get('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
        console.log(listing);
        res.render("./listings/show.ejs", { listing });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid ID");
    }
});


// Create Route
router.post('/new', isLoggedIn, upload.single("listing[image]"), async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
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
