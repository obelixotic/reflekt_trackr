const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users_model');
const sessions = express.Router();

// ROUTES
// new
sessions.get('/new', (req, res) => {
    console.log('session/new', req.session.currentUser);
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser
    });
});

// create
sessions.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        console.log(foundUser);
        if (!foundUser) {
            res.redirect('/sessions/new');
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.redirect('/');
            } else {
                res.redirect('/sessions/new');
            }
        }
    });
});

module.exports = sessions;