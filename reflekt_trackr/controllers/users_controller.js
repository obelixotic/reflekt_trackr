const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users_model.js');
const users = express.Router();

// ROUTES
// new
users.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        currentUser: '',
        tabTitle: 'Signup'
    });
});

// create
users.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    User.create(req.body, (err, createdUser) => {
        // console.log('User created: ', createdUser);
        // req.session.currentUser = undefined; //this to reset the req.session.currentUser else, the index.ejs will show name of the last signed in user, if there is one. *bug*
        // res.redirect('/');
        req.session.destroy(() => {
            // console.log(req.session);
            res.redirect('/')
        });
    });
});

module.exports = users;