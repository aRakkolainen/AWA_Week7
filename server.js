const express = require('express');
const app = express(); 
const path = require('path');
const port = 3000;
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');
//const initializePassport = require('./passport.config')
let users = []; 
app.use(express.json());

//const initializePassport = require('./passport-config');
//initializePassport(passport, users)

app.use(session({
    secret: "AEK3412eEKMDOAMONEOENFONA#EMDF", 
    resave: false, 
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

async function authenticateUser(username, password) {
    
    const user = users.find((user) => user.username === username);
    if (user === null) {
        console.log("User not found");
        return false;
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            console.log("Login was successful for user " + user.username + "!");
            return true
        } else {
            console.log("Incorrect password!");
            return false;
        }
    } catch(e) {
        return done(e);
    }
    
} 

passport.use(new LocalStrategy(authenticateUser))

app.post("/api/user/register", async (req, res) => {
    //console.log(req.body);
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
            res.send(user);
        }
        
        } catch(error) {
            res.send(error)
        }
});

app.post("/api/user/login", async (req, res) => {
    try {
        let loginStatus = await authenticateUser(req.body.username, req.body.password);
        if (loginStatus == true) {
            res.status(200).send("Login succeeded!");
        } else {
            res.status(401).send("Login failed!");
        }
    } catch(err) {
        res.send(err);
    }
})

// Route for returning a list of registered users
app.get("/api/user/list", (req, res) =>{
    res.send(users)
})


app.listen(port, () => console.log("Server running at port ", port));
