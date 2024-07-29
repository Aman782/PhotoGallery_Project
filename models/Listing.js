const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const Review = require('./reviews')

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    __v: Number
});

listingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
