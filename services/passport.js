const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local')
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
const config = require('../config')

// Tell LocalStrategy to look for username on req.email
const localOptions = { usernameField: 'email' }
// Create local strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify email and password, call done with user if it is correct
  // email and password, otherwise call done with false
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err) }

    // User not found in DB
    if (!user) { return done(null, false) }

    // Compare user password with request password
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false) }

      // Passport conventiently attaches user to req.user in the request flow
      return done(null, user)
    })
  })
})

// Set up options for JWT strategy
const jwtOptions = {
  // Whenever a request comes in that we want passport to handle, we want it to
  // look for it in a header key 'authorization'
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in payload exists in our DB
  // If it does, call 'done' with that user
  // Otherwise, call 'done' with false
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
