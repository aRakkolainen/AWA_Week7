//This is created based on lecture material!

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUser, getUserID) {
    const authenticateUser = async (username, password, done) => {
        const user = getUser(username);
        if (user == null) {
            console.log("User not found!");
            return done(null, false);

        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("Login was successful for user " + user.username + "!");
                return done(null, user);
            } else {
                console.log("Incorrect password!");
                return done(null, false)
            }
        } catch(e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy(authenticateUser));

    /*passport.serializeUser(function(user, done) {
        process.nextTick(function() {
            return done(null, )
        })
    })*/
    //Fixing error: https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserID(id));
    })
}

module.exports = initialize;