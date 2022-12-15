const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema Setup for Movies
// Define the Variables of Database
const userSchema = new Schema({
    username: String,
    email: String,
    passwordHash: String,
    passwordSalt: String,

}, {timestamps: true});


// Model Setup
const User = mongoose.model('User', userSchema);
module.exports = User;

