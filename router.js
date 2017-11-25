const passport = require('passport')
const AuthenticationController = require('./controllers/authentication')
const passportService = require('./services/passport')

// Create the passport middleware to be used for any protected routes
const requireAuth = passport.authenticate('jwt', { session: false })

// Create passport middleware for sign in
const requireSignIn = passport.authenticate('local', { session: false })

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' })
  })
  app.post('/signin', requireSignIn, AuthenticationController.signIn)
  app.post('/signup', AuthenticationController.signup)
}
