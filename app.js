var express=require('express');
var app=express();
var mongoose=require('mongoose');
var passport=require('passport');
var bodyParser=require('body-parser');
var LocalStrategy=require('passport-local');
var passportLocalMongoose=require('passport-local-mongoose');
var User=require('./models/user');
const port=3000;
const hostname="localhost";
//connecting to mongoose
mongoose.connect("mongodb://localhost/authdemo");

app.use(require("express-session")({
    secret:"this is my secret",
    resave:false,
    saveUninitialized:false
}));

//telling express to use passport
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

//they read teh session de seraialize the session and decode it
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================================================
//                  ROUTES
//==================================================

app.get("/",function(req,res){
    res.render("home");
})
app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
})
//AUTH ROUTE
app.get("/register",function(req,res){
    res.render("register");
});
//POST ROUTE
app.post("/register",function(req,res){
    //res.send("register ho gaya");
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register")
        }
            passport.authenticate("local")(req,res,function(){
                    res.redirect("/secret");
            });
    });
});
//LOGIN ROUTES
app.get("/login",function(req,res){
    res.render("login");
});
//login login
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){
});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(port,hostname,()=>{
    console.log(`The AuthDemo server is running at ${hostname}: ${port}`);
});