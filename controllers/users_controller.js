const express = require('express');
const User = require('../models/users_model.js');
const users = express.Router();

// ROUTES
// new
users.get('/new', (req, res) => {
    res.send('sign up page');
});

// create
users.post('/', (req, res) => {
    res.send(`user created with creds: ${req.body.username}, ${req.body.password}`);
});

module.exports = users;