const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post' // Ensure this matches the model name in post.js
        }
    ]
});

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;