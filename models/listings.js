const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const ListingsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    // user: {
    //     type: ObjectId,
    // }
});

const Listing = mongoose.model('Listing', ListingsSchema);
module.exports = Listing;
