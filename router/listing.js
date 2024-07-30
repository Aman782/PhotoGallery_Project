const express = require('express');
const Listing = require('../models/Listing');
const ExpressError = require('../Utils/ExpressError');
const router = express.Router({mergeParams:true});


// Show Route
router.get('/listing/new', (req, res) => {
    res.render('../listings/new.ejs');
});


// Create Route
router.post('/listing/new', async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log(req.body)
        res.redirect('/home');
    } catch (error) {
        // console.error(error);
        // res.status(400).send("Error creating new listing");
        next(err);
    }
});

// Edit Route
router.get('/listing/edit/:id', async (req, res, next) => {
    try{
        let { id } = req.params;
        let listing = await Listing.findById(id);
        console.log(id);
        console.log(listing);
        res.render('../listings/update.ejs', { listing });
    }catch(err){
        next(err);
    }
    
});


// Update Route
router.put('/listing/edit/:id', async (req, res) => {
    try{
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect('/home');
    }catch(e){
        console.log(e)
    }
    
});


// Delete Route
router.delete('/listing/delete/:id', async (req, res, next) => {
    try{
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect('/home');
    }catch(err){
        next(err);
    }
    
});

module.exports = router;