const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users_model');
const sessions = express.Router();

// ROUTES
// new session
sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser,
        tabTitle: 'Login',
    });
});

// create session
sessions.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        // console.log(foundUser);
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

// delete session
sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
});


module.exports = sessions;