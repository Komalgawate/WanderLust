const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const Usercontroller=require("../controllers/user.js");
router.get("/signUp",Usercontroller.renderSignupform);

router.post("/signup",wrapAsync(Usercontroller.signUp));

router.get("/login",Usercontroller.renderLoginform);
router.post("/login",
     passport.authenticate("local",
    {failureRedirect:'/login'
    ,failureFlash:true}),
    Usercontroller.login
    );
router.get("/logout",Usercontroller.Logout);
module.exports=router;