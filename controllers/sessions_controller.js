const express = require('express');
const User = require('../models/users_model');
const sessions = express.Router();

// ROUTES
// new
sessions.get('/new', (req, res) => {
    // res.send('log in page');
    res.render('sessions/new.ejs');
});

// create
sessions.post('/', (req, res) => {
    // res.send(`if valid, user signed in with creds: ${req.body.username}, ${req.body.password}`);
    console.log(`${req.body.username}, ${req.body.password}`);
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        console.log(foundUser);
        if (foundUser) {
            req.session.curentUser = foundUser;
            res.send(req.session.curentUser);
        } else {
            // req.session.curentUser = 'none';
            res.redirect('/sessions/new');
        }
    });
});

module.exports = sessions;