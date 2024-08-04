const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user');
const passport = require('passport');
const {saveRedirectUrl} = require('../authenticate');

router.get('/signup', (req, res)=>{
    res.render('../views/users/signup.ejs');
})

router.post('/signup', async(req, res)=>{
    try{
        let {username, email, password} = req.body;

        const newUser = new User({email, username});
        const regisUser = await User.register(newUser, password);
        console.log(regisUser);
    
        req.login(regisUser, (err)=>{
           if(err){
            return next(err);
           }
           req.flash("success", "Registered Successfully");
           res.redirect('/home');
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect('/signup');
    }
})

router.get('/login', (req, res)=>{
    res.render('../views/users/login.ejs');
})

router.post('/login', saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash:true}), async(req, res)=>{
  req.flash("success", "Welcome!, logged in Successfully");
  let redirectUrl = res.locals.redirectUrl || "/home";
  res.redirect(redirectUrl);
    //  res.redirect('/home');
})

router.get('/logout', (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success", "you logged out successfuly!");
            res.redirect('/home');
        }
    })
})


module.exports = router;
