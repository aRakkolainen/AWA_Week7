const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, users) {
    const authenticateUser = async (username, password, done) => {
        console.log(users)
        const user = users.find((user) => user.username === username);
        if (user === null) {
            console.log("User not found");
            return false
        }
    
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("Login was successful for user " + user.username + "!");
                return true
            } else {
                console.log("Incorrect password!");
                return false
            }
        } catch(e) {
            return e;
        }
        
    } 
    passport.use(new LocalStrategy(authenticateUser))
}

module.exports = initialize
