const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listings.js');

const url = "mongodb://127.0.0.1:27017/photosgallery";

async function main() {
  await mongoose.connect(url);
  console.log('Connected to MongoDB');
}
main().catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
}

initDB();
