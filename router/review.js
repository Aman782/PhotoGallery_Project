const express = require('express');
const Review = require('../models/reviews.js');
const Listing = require('../models/Listing.js');
const ExpressError = require('../Utils/ExpressError.js');
const router = express.Router({mergeParams:true});

router.get('/', async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render('../views/reviews/review.ejs', { listing });
    } catch (err) {
        next(err);
    }
});


router.post('/', async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        console.log(req.body.review);
        let newReview = new Review(req.body.review);
        let o = await newReview.save();
        console.log(o);
        listing.reviews.push(o._id);
        await listing.save();  // Save the updated listing document
        console.log(listing);
        res.redirect(`/home/${id}`);
    } catch (err) {
        next(err);
    }
});


router.delete('/:reviewId', async (req, res, next)=>{
   try{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});   
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/home/${id}`);
   }catch(err){
     next(err);
   }
  
})

module.exports = router;