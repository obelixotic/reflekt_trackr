const express = require('express');
const Habit = require('../models/habits_model.js');
const User = require('../models/users_model.js');
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
habits.get('/', (req, res) => {
    // res.send('Hello hello, I see you\'ve authenticated');
    Habit.find({}, (err, allHabits) => {
        res.render('habits/index.ejs', {
            habits: allHabits,
            currentUser: req.session.currentUser
        });
    });
});

// new
habits.get('/new', (req, res) => {
    // res.send('new');
    res.render('habits/new.ejs')
});

//create
habits.post('/', (req, res) => {
    // res.send(req.body);
    Habit.create(req.body, (error, createdHabit) => {
        console.log(createdHabit);
        User.updateOne({ username: req.session.currentUser.username }, { $push: { days: `${createdHabit['_id']}` } }, (err, linkCreated) => {
            res.redirect('/habits/');
        });
    });
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