const express = require('express');
const expressValidator = require('express-validator');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });


// Connect to our Database and handle an bad connections
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`Error!! → ${err.message}`);
});

require('./models/Link');

const Link = mongoose.model('Link');

// create our Express app
const app = express();

// Exposes a bunch of methods for validating data.
app.use(expressValidator());


app.get('/', (req, res) => {
    res.send('Follow instructions at https://www.freecodecamp.com/challenges/url-shortener-microservice');

});

app.get('/:short_url', async (req, res) => {
    
    // fetch from db the full url
    const link = await Link.findOne(req.params);
    
    if (link === null) {
        res.json({ error: 'ShortId is not valid!' });
        return;
    }
    
    // redirect to full url
    res.redirect(link.original_url);
    
});

app.get('/new/:original_url(*)', async (req, res) => {

    // return https: only for https://www.google.com so cannot!!!

    // validate if url is not valid
    if (! req.checkParams('original_url').isURL()) {
        res.json({ error: 'URL is not valid!' });
        return;
    }
    
    // if url is valid try grab from database and return short url
    const link = await Link.findOne({original_url: req.params.original_url});
    
    if (link !== null) {
        res.json({ 
            original_url: link.original_url, 
            short_url: `${req.protocol}://${req.get('host')}/${link.short_url}`
        });
        
        return;
    }
    
    const newlink = await Link.create(req.params);
    
    res.json({ 
        original_url: newlink.original_url, 
        short_url: newlink.short_url
    });

});

// To run your application run the command node server.js in your console.
// Cloud9 use port 8080
app.listen(process.env.PORT || 8080, function () {
  console.log('URL Shortener App started!')
});