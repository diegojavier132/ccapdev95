const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema Setup for Movies
// Define the Variables of Database
const moviesSchema = new Schema({
    title: String,
    keyword: String,
    genre: String,
    runTime: String,
    year: String,
    director: String,
    cast: [String],
    type: String,
    lastUpdated: String,
    plot: String,
    img: String,
    
    // Reviews of the Posts
    comments: [{
        user: String,
        content: String,
        likes: String,
    }]
}, {timestamps: true});


const Movies = mongoose.model('Movies', moviesSchema);
module.exports = Movies;