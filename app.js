const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const methodOverride = require('method-override');
const url = "mongodb://127.0.0.1.27017/photogallery";
const ejsMate = require('ejs-mate');

async function main(){
    await mongoose.connect(url);
}

main().then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/pulbic")));


app.listen(8585, ()=>{
    console.log("listening at port 8585");
})

app.get("/", (req, res)=>{
    res.send("HI, I am root");
})


