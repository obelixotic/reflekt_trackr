const express = require('express');
const Habit = require('../models/habits_model.js');
const habits = express.Router();

// MIDDLEWARE
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect('/sessions/new');
    }
};

// ROUTES
// index
habits.get('/', isAuthenticated, (req, res) => {
    // res.send('Hello hello, I see you\'ve authenticated');
    res.render('habits/index.ejs', {
        currentUser: req.session.currentUser
    });
});

// new
habits.get('/new', (req, res) => {
    res.send('new');
});

//create
habits.post('/', (req, res) => {
    res.send(req.body);
});

// show
habits.get('/:id', (req, res) => {
    res.send(`show ${req.params.id}`);
});

// edit
habits.get('/:id/edit', (req, res) => {
    res.send(`edit ${req.params.id}`);
});

// update
habits.put('/:id', (req, res) => {
    res.send(`update ${req.params.id}`);
});

// delete
habits.delete('/:id', (req, res) => {
    res.send(`delete ${req.params.id}`);
});

module.exports = habits;