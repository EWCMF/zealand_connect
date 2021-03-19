const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const verifyPassword = require('../encryption/password').verifyPassword;


//lav cookie fra user baseret på id
passport.serializeUser((user, done)=>{
    //admin har ikke email, men username
    if(user.email != null){
        done(null, user.email);
    }
    if(user.username != null){
        done(null, user.username);
    }
});

//modtager en id fra cookie, så vi kan se om hvem der tilhører id'en
passport.deserializeUser((cookieID, done)=>{
    findUserByEmail(cookieID).then((user)=>{
        //admin bruger ikke email, men username
        if(user.email!=null){
            done(null, user.email);
        }
        else {
            done(null, user.username);
        }
    })
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function(username, password, done) {
            //når vi prøver at logge ind, skal vi checke om brugeren findes i db
            findUserByEmail(username).then(async(user)=>{
                if(user==null){
                    //redirect user back to login page with faliure message
                    return done(null, false, { message: '?error=incorrectusername' });
                } else {
                    //user exists in the database, now check if the password matches
                    verifyPassword(password, user.password).then((match)=>{
                        if(match){
                            return done(null, user, { message: '?error=none' });
                        } else {
                            return done(null, false, { message: '?error=incorrectpassword' });
                        }
                    })
                }
            });
        }
    )
);