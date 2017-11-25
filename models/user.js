const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt-nodejs')

// Define our model
const userSchema = new Schema({
  // Tells mongoose to ensure that the email property is unique
  email: { type: String, unique: true, lowercase: true },
  password: String
})

// On-save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // Get access to the user model
  const user = this

  // Generate a salt, then run callback once its ready
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err) }

    // Hash/encrypt the password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err) }

      // Overwrite plain-text password with hashed password which contains both
      // the salt and the encrypted password
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // bcrypt internally hashes candidate password with saved password's salt to
  // determine if candidatePassword matches initial password
  bcrypt.compare(candidatePassword, this.password, callback)
}

// Create the model class
// Loads new schema into mongoose under collection named 'user'
// Represents a CLASS of users
const ModelClass = mongoose.model('user', userSchema)

// Export the model so others can use it
module.exports = ModelClass
