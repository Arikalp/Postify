const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost:27017/miniproject1');
    console.log('MongoDB connected successfully');
}
catch (error) { 
    console.error('MongoDB connection error:', error);
}

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;