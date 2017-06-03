const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shortid = require('shortid');
const validator = require('validator');


const linkSchema = new mongoose.Schema({
    
    short_url: {
        type: String,
        unique: true,
        default: shortid.generate
    },
    
    original_url: {
        type: String,
        trim: true,
        unique: true,
        validate: [validator.isURL, 'Invalid URL'],
        required: 'Please enter a valid url!'
    }
    
});

module.exports = mongoose.model('Link', linkSchema);