const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/Listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');
const Review = require('./models/reviews.js');
const listingsRoutes = require('./router/listing')
const reviewRoutes = require('./router/review');


const url = "mongodb://127.0.0.1:27017/photosgallery";

async function main() {
  await mongoose.connect(url);
  console.log('Connected to MongoDB');
}

main().catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.listen(4000, () => {
    console.log("listening at port 4000");
});


// Root route
app.get("/", (req, res) => {
    res.send("HI, I am root");
});


// Home Route
app.get('/home', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/home.ejs", { allListings });
});


// Show route
app.get('/home/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id).populate("reviews");
        console.log(listing);
        res.render("./listings/show.ejs", { listing });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid ID");
    }
});

app.use('/listing', listingsRoutes);
app.use('/listing/:id/reviews', reviewRoutes);


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).send(message);
})
