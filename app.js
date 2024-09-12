if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // Ensure .env is loaded in development
}

const URL = "mongodb+srv://amanpandey45692:12OuC1aQT4UduJL5@projectsnapbox.nkxy2.mongodb.net/?retryWrites=true&w=majority&appName=ProjectSnapbox"

const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const express = require('express');
const app = express();

console.log("Environment:", process.env.NODE_ENV);
console.log("MongoDB URL:", process.env.MONGO_URL);

mongoose.connect(URL)
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => console.error("DB connection error:", err));

    app.listen(PORT, () => {
        console.log("App started!");
      });
    
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
const multer = require('multer');
const upload = multer({dest: 'uploads/'})


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


// Root route
app.get("/", (req, res) => {
    res.send("HI, I am root");
});

// Home Route
app.get('/home', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/home.ejs", { allListings });
});


app.use('/listing', listingsRoutes);
app.use('/listing/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});
