const User=require("../models/user.js");
module.exports.renderSignupform=(req,res)=>
    {
        res.render("./users/signUp.ejs");
    };
module.exports.signUp=async(req,res)=>{
    try
    {
    let {username,email,password}=req.body;
    const newuser= new User({email,username});
    const reguser=await User.register(newuser,password);
    console.log(reguser);
    req.login(reguser,(err)=>{
        if(err){
            return next(err);
        }
     req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
    });
    }
    catch(error){
      req.flash("error",error.message);
      res.redirect("/signup");
    }
}

module.exports.renderLoginform=(req,res)=>{
    
    res.render("./users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
 };

 module.exports.Logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logout now");
        res.redirect("/listings");
    })
};