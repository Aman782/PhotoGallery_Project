const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/Listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

app.get("/", (req, res) => {
    res.send("HI, I am root");
});

app.get('/home', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./home.ejs", { allListings });
});

app.get('/home/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        res.render("./show.ejs", { listing });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid ID");
    }
});

app.get('/listing/new', (req, res) => {
    res.render('./new.ejs');
});

app.post('/listing/', async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log(req.body)
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(400).send("Error creating new listing");
    }
});

app.get('/listing/edit/:id', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(id);
    console.log(listing);
    res.render('./update.ejs', { listing });
});

app.put('/listing/edit/:id', async (req, res) => {
    try{
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect('/home');
    }catch(e){
        console.log(e)
    }
    
});

app.delete('/listing/delete/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/home');
});
