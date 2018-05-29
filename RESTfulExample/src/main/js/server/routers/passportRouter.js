var express = require('express');
var path = require('path');
var PassportRouter = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var User = require(path.join(__dirname + '/../models/users'));

var passportrouter = function (passport) {
    PassportRouter.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname + '/../../src/login.html'));
    });

    /* Handle Login POST */
    PassportRouter.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /* GET Registration Page */
    PassportRouter.get('/signup', function (req, res) {
        res.sendFile(path.join(__dirname + '/../../src/signup.html'));
    });

    /* Handle Registration POST */
    PassportRouter.post('/signup', passport.authenticate('signup', {
        successRedirect: '/login',
        failureRedirect: '/login',
        failureFlash: true
    }));

    PassportRouter.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use('login', new LocalStrategy(
        {
            passReqToCallback: true,
        },
        function (req, username, password, done) {
            User.findOne({ 'username': username },
                function (err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log error & redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false,
                            req.flash('message', 'User Not found.'));
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false,
                            req.flash('message', 'Invalid Password'));
                    }
                    // User and password both match, return user from 
                    // done method which will be treated like success
                    return done(null, user);
                }
            );
        }
    ));
    
    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }
    
    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
            findOrCreateUser = function () {
                // find a user in Mongo with provided username
                User.findOne({ 'username': username }, function (err, user) {
                    // In case of any error return
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists');
                        return done(null, false,
                            req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');
    
                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
    
            // Delay the execution of findOrCreateUser and execute 
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));
    
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    return PassportRouter;
};


module.exports = passportrouter;