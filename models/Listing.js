const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    location: String,
    country: String,
    user: Array,
    __v: Number
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
