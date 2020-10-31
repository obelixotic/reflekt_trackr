const express = require('express');
const sessions = express.Router();

// ROUTES
// new
sessions.get('/new', (req, res) => {
    res.send('log in page');
});

// create
sessions.post('/', (req, res) => {
    res.send(`if valid, user signed in with creds: ${req.body.username}, ${req.body.password}`);
});

module.exports = sessions;