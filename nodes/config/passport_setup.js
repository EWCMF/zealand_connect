const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const verifyPassword = require('../encryption/password').verifyPassword;


//lav cookie fra user baseret på id
passport.serializeUser((user, done)=>{
    console.log('User is being serialized so browser has a cookie so it can be identified!');
    done(null, user.email);
})

//modtager en id fra cookie, så vi kan se om hvem der tilhører id'en
passport.deserializeUser((cookieID, done)=>{
    findUserByEmail(cookieID).then((user)=>{
        done(null, user.email);
    })
})

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function(username, password, done) {
            console.log('Youve reached the local strat callback!');
            //når vi prøver at logge ind, skal vi checke om brugeren findes i db
            findUserByEmail(username).then(async(user)=>{
                if(user==null){
                    //redirect user back to login page with faliure message
                    console.log("ERROR: USER NOT FOUND---\nERROR: USER NOT FOUND---\nERROR: USER NOT FOUND---\n");
                    return done(null, false, { message: '?error=incorrectusername' });
                } else {
                    console.log("SUCCESS: USER FOUND---\nSUCCESS: USER FOUND---\nSUCCESS: USER FOUND---\n");
                    //let crypt = await becrypt.hash(password, 10)
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