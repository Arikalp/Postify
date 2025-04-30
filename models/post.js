const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
    content: String,
    user: { // Reference to the UserModel
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    createdAt: { type: Date, default: Date.now }
});

// Register the model with the name "post"
const Postmodel = mongoose.model('post', postSchema);

module.exports = Postmodel;


