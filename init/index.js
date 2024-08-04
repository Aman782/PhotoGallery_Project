const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/Listing.js');

const url = "mongodb://127.0.0.1:27017/photosgallery";

async function main() {
  await mongoose.connect(url);
  console.log('Connected to MongoDB');
}
main().catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "66add3f217aac50439e792e6"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
}

initDB();
