const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const sampleData = require('./init/data');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const url = "mongodb://127.0.0.1:27017/photosgallery";

async function main() {
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
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

app.get("/home", (req, res) => {
    res.render("home", { sampleData });
});
