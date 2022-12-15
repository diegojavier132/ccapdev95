const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema Setup for Movies
// Define the Variables of Database
const postSchema = new Schema({
    username: String,

    // Reviews of the Posts
    postcontent: [{
        id: String,
        content: String,
        votes: Number,
        likes: Number,
        shares: Number,
        date: String,
        time: String,
    }]
});


// Model Setup
const Post = mongoose.model('Post', postSchema);
module.exports = Post;