// THOUGHTS
// have a habits collection and save the username from the session in it. when user index page loads, find the habit names corresponding to the username and populate the index page - DONE
// save habit _id in every entry. then i can just look up entry with the habits _id and sort them by the timestamp to display calender view - DONE

const express = require('express');
const Habit = require('../models/habits_model.js');
const User = require('../models/users_model.js');
const Entry = require('../models/entries_model.js');
const habits = express.Router();
const getDay = require('date-fns/getDay');
const getDate = require('date-fns/getDate');

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
    if (req.session.currentUser) {
        // if authenticated
        Habit.find({ user: req.session.currentUser.username }, (err, allHabits) => {
            let promArray = [];
            for (habit of allHabits) {
                // console.log('habit._id: ', habit._id);
                let prom = Entry.find({ habit_id: habit._id }, (err, habitEntries) => {
                    // console.log('habitEntries: ', habitEntries);
                });
                promArray.push(prom);
            }
            Promise.all(promArray).then((allEntries) => {
                res.render('habits/index.ejs', {
                    habits: allHabits,
                    currentUser: req.session.currentUser,
                    entries: allEntries,
                    tabTitle: 'Home'
                });
            });
        });
    } else {
        // if not authenticated
        res.render('habits/index.ejs', {
            habits: '',
            currentUser: '',
            entries: '',
            tabTitle: 'Home'
        });
    }
});

// new
habits.get('/new', isAuthenticated, (req, res) => {
    // res.send('new');
    res.render('habits/new.ejs', {
        tabTitle: 'New habit',
        currentUser: req.session.currentUser
    });
});

//create
habits.post('/', isAuthenticated, (req, res) => {
    req.body.done = false;
    req.body.user = req.session.currentUser.username;
    req.body.name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.toLowerCase().slice(1);
    req.body.category = req.body.category.toLowerCase().charAt(0).toUpperCase() + req.body.category.toLowerCase().slice(1);
    // req.body.date = Date.now();
    Habit.create(req.body, (err, createdHabit) => {
        if (err) {
            console.log(err);
        } else {
            console.log(createdHabit);
            // User.updateOne({ username: req.session.currentUser.username }, { $push: { habits: `ObjectId("${createdHabit['_id']}")` } }, (err, linkCreated) => {

            // adding dates to each entry
            let creationDay = getDay(Date.now());
            let creationDate = getDate(Date.now());
            console.log(creationDay, creationDate);

            // create default false entries for a week
            let promArray = [];
            for (let i = 0; i < 7; i++) {
                let prom = Entry.create({ habit_id: createdHabit['_id'] });
                promArray.push(prom);
            }
            Promise.all(promArray).then((allEntries) => {
                res.redirect('/habits/');
            });
        }
    });
});

// make a daily entry
habits.patch('/:id/entry', (req, res) => {
    // req.body.habit_id = req.params.id;
    if (req.body.done === "false") {
        req.body.done = true;
    } else {
        req.body.done = false;
    }
    console.log(req.body);
    // res.send(req.body);
    Entry.findByIdAndUpdate(req.params.id, { $set: { done: req.body.done } }, (err, result) => {
        res.redirect('/habits/');
    });
});

// show
habits.get('/:id', (req, res) => {
    // res.send(`show ${req.params.id}`);
    Habit.findById(req.params.id, (err, foundHabit) => {
        res.render('habits/show.ejs', {
            tabTitle: foundHabit.name,
            currentUser: req.session.currentUser,
            habit: foundHabit,
            id: req.params.id
        });
    });
});

// edit
habits.get('/:id/edit', (req, res) => {
    // res.send(`edit ${req.params.id}`);
    Habit.findById(req.params.id, (err, foundHabit) => {
        console.log(foundHabit);
        res.render('habits/edit.ejs', {
            tabTitle: 'Edit habit',
            currentUser: req.session.currentUser,
            habit: foundHabit,
            id: req.params.id
        });
    });
});

// update
habits.put('/:id', (req, res) => {
    // console.log(req.body);
    // res.send(`update ${req.params.id}`);
    req.body.name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.toLowerCase().slice(1);
    req.body.category = req.body.category.toLowerCase().charAt(0).toUpperCase() + req.body.category.toLowerCase().slice(1);

    Habit.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, category: req.body.category } }, (err, result) => {
        res.redirect(`/habits/${req.params.id}`);
    });
});

// delete
habits.delete('/:id', (req, res) => {
    // res.send(`delete ${req.params.id}`);
    Habit.findByIdAndDelete(req.params.id, (err, deleted) => {
        res.redirect('/habits');
    });
});

module.exports = habits;