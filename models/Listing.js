const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


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

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
