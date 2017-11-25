const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

const tokenForUser = user => (
  // Create a JSON Web Token for the user by combining the user's id, the
  // current timestamp, and our secret string
  jwt.encode({
    sub: user.id,
    iat: new Date().getTime()
  }, config.secret)
)

exports.signIn = function(req, res, next) {
  // User has already had their email and password auth'd by passport
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = function(req, res, next) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide both an email and a password.'})
  }

  // See if a user with the given email exists in our records
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

    // If a user with email does exist, respond with an error
    if (existingUser) {
      // Mark HTTP response status as 422 (unprocessable entity)
      // And respond to user with error message
      return res.status(422).send({ error: 'Email is in use' })
    }

    // If a user with email does not exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })

    // Actually save user record to DB (this takes time so we need to use a
    // callback to know when its done)
    user.save(function(err) {
      if (err) { return next(err) }

      // Respond to request with a JSON Web Token (JWT) which is a combination
      // of the userID and our SUPER (!!!) secret string
      // Then the client will attach the JWT with any requests for protected
      // requests which when merged with our secret string will give us their
      // userID. Yay, authenticated!
      res.json({ token: tokenForUser(user) })
    })
  })
}
