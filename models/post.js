const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const Postmodel = mongoose.model('Postmodel', userSchema);

module.exports = Postmodel;