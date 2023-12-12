const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, users) {
    const authenticateUser = async (username, password, done) => {
        const user = users.find((user) => user.username === username);
        if (user === null) {
            console.log("User not found");
            return done(null, false);
        }
    
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("Log in was successful for user " + user.username + "!");
                return done(null, user);
            } else {
                console.log("Incorrect password!");
                return done(null, false);
            }
        } catch(e) {
            return done(e);
        }
        
    } 
    passport.use(new LocalStrategy(authenticateUser))
}

module.exports = initialize
