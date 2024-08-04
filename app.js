const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/Listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');
const Review = require('./models/reviews.js');
const listingsRoutes = require('./router/listing');
const reviewRoutes = require('./router/review');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');
const userRoutes = require('./router/user.js');

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

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

// In passport method the hashing function used is "pbkdf2" algorithm
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.listen(4000, () => {
    console.log("listening at port 4000");
});

// app.get('/register', async (req, res)=>{
//     let demoUser = new User({
//         email:"demouser@gmail.com",
//         username: "developer",
//     });

//     let regDemoUser = await User.register(demoUser, "hellodemoUser");
//     res.send(regDemoUser);
// })

// Root route
app.get("/", (req, res) => {
    res.send("HI, I am root");
});

// Home Route
app.get('/home', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/home.ejs", { allListings });
});


app.use('/listing', listingsRoutes);  // Ensure this matches the form action
app.use('/listing/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});
