const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/Listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');
const Review = require('./models/reviews.js');

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
    res.render("./home.ejs", { allListings });
});


// Show route
app.get('/home/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id).populate("reviews");
        console.log(listing);
        res.render("./show.ejs", { listing });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid ID");
    }
});


app.get('/listing/new', (req, res) => {
    res.render('./new.ejs');
});


// Create Route
app.post('/listing/', async (req, res, next) => {
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


app.get('/listing/edit/:id', async (req, res, next) => {
    try{
        let { id } = req.params;
        let listing = await Listing.findById(id);
        console.log(id);
        console.log(listing);
        res.render('./update.ejs', { listing });
    }catch(err){
        next(err);
    }
    
});


// Update Route
app.put('/listing/edit/:id', async (req, res) => {
    try{
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect('/home');
    }catch(e){
        console.log(e)
    }
    
});


// Delete Route
app.delete('/listing/delete/:id', async (req, res, next) => {
    try{
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect('/home');
    }catch(err){
        next(err);
    }
    
});


app.get('/listing/:id/reviews', async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render('./review.ejs', { listing });
    } catch (err) {
        next(err);
    }
});


app.post('/listing/:id/reviews', async (req, res, next)=>{
    try{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        console.log(req.body.review);
        let newReview = new Review(req.body.review);
        let o = await newReview.save();
        console.log(o);
        listing.reviews.push(o._id);
        console.log(listing);
        res.redirect(`/home/${id}`);
    }catch(err){
        next(err);
    }
});



app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).send(message);
})
