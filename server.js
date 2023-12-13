//This is based on lecture materials from week 7 in course Advanced Web Applications

const express = require('express');
const app = express(); 
const path = require('path');
const port = 3000;
const passport = require('passport');
const bcrypt = require('bcrypt');
const session = require('express-session');
//const initializePassport = require('./passport.config')
let users = []; 
app.use(express.json());

app.use(session({
    secret: "AEK3412eEKMDOAMONEOENFONA#EMDF", 
    resave: false, 
    saveUninitialized: false, 
    cookie: {}
}))
app.use(passport.initialize());
app.use(passport.session());

function getUser(username) {
    let user = users.find((user) => user.username === username)
    return user
}
function getUserID(id) {
    return users.find((user) => user.id == id);
}
const initializePassport = require('./passport-config');
initializePassport(passport, getUser, getUserID);
app.use(passport.initialize());
app.use(passport.session());

app.post("/api/user/register", async (req, res) => {
    console.log("Registering...");
    //console.log(req.session.cookie.domain)
    if (req.session.cookie.domain == "connect.sid") {
        console.log("Already logged in!")
        res.redirect("/")
    } else {
        try {
            let username = req.body.username;
            let password = req.body.password;
            // Checking whether there exists user with specific username is based on this: https://stackoverflow.com/questions/40438851/use-javascript-to-check-if-json-object-contain-value
            if (users.some(user => user.username === req.body.username)) {
                res.status(400).send("User exists already!");
            } else {
                let hashedPassword = await bcrypt.hash(password, 10);
                let id = Math.floor(Math.random()*5000)+1;
                let user = {
                    "id": id,
                    "username": username,
                    "password": hashedPassword
                }
                users.push(user);
                res.send(user)
            }
        
            } catch(error) {
                res.redirect("/api/user/register")
            }
        }
});
app.get("/", (req, res) => {
    console.log("Registering succeeded")
    res.send("Registering succeeded")
})
app.get("/api/user/login", checkNotAuthentication, (req, res) => {
    console.log("This is login page")
    res.send("Login page")
  //  console.log(req.cookie);
   // res.status(200).send("Login succeeded!");
})

app.post("/api/user/login", checkNotAuthentication, passport.authenticate("local", {session: this}), function (req, res){
    if (req.session == false) {
        res.status(401).send("Login failed!"); 
    }
    //req.session.cookie.domain = "connect.sid";
    req.session.domain = "connect.sid";
    //console.log(req.session.cookie)
    res.status(200).send("Login was successful!");
})
            
// Route for returning a list of registered users
app.get("/api/user/list", (req, res) =>{
    res.send(users)
})
//Secret route that should be available only users that are logged in
app.get("/api/secret", checkAuthentication, (req, res) => {
    console.log("Secret page!");
    res.status(200).send("Authorized")
})


// Checking if user is already logged in
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
       console.log("Authorized user!");
        return res.send("You're at secret page!");
    } 
    return res.sendStatus(401);
}
// Checking if user is not logged in
function checkNotAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return next();
}

app.listen(port, () => console.log("Server running at port ", port));
