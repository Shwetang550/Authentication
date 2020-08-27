var express               = require("express"),
    mongoose              = require("mongoose"),
	passport              = require("passport"),
	localStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user")

mongoose.connect("mongodb://localhost:27017/auth_demo_app");


var app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret:"anukul saini is the best",
	// this secret is to decode 
	resave:false,
	saveUninitialized:false
}));
// we need these two following lines when we use passport.js
app.use(passport.initialize());
app.use(passport.session());

// responsible for decoding and incoding data ..in the user module we have added passport-local-mongoose due tow hich these two works
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
	res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
});

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}), req.body.password,function(err,user){
		if (err){
			console.log(err)
			return res.render("/register");
		}
		{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/secret");
			});
		}
	});
});

app.get("/login",function(req,res){
	res.render("login");
});
//using middleware in next route
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


app.listen(3000,function(){
	console.log('SERVER LISTENING');
});