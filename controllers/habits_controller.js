// THOUGHTS
// have a habits collection and save the username from the session in it. when user index page loads, find the habit names corresponding to the username and populate the index page - DONE
// save habit _id in every entry. then i can just look up entry with the habits _id and sort them by the timestamp to display calender view

const express = require('express');
const Habit = require('../models/habits_model.js');
const User = require('../models/users_model.js');
const Entry = require('../models/entries_model.js');
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
    if (req.session.currentUser) {
        Habit.find({ user: req.session.currentUser.username }, (err, allHabits) => {
            let promArray = [];
            for (habit of allHabits) {
                console.log('habit._id: ', habit._id);
                let prom = Entry.find({ habit_id: habit._id }, (err, habitEntries) => {
                    console.log('habitEntries: ', habitEntries);
                });
                promArray.push(prom);
            }
            Promise.all(promArray).then((allEntries) => {
                res.render('habits/index.ejs', {
                    habits: allHabits,
                    currentUser: req.session.currentUser,
                    entries: allEntries
                });
            });
        });
    } else {
        res.render('habits/index.ejs', {
            habits: '',
            currentUser: '',
            entries: ''
        });
    }
});
// <% for (let entry of entries) { %>
//     <form action="/habits/<%= entry._id %>/entry?_method=PATCH" method="POST">
//         <input type="submit" value="done" class="btn-small" />
//     </form>
//     <% } %>


// new
habits.get('/new', isAuthenticated, (req, res) => {
    // res.send('new');
    res.render('habits/new.ejs')
});

//create
habits.post('/', isAuthenticated, (req, res) => {
    req.body.done = false;
    req.body.user = req.session.currentUser.username;
    Habit.create(req.body, (err, createdHabit) => {
        if (err) {
            console.log(err);
        } else {
            console.log(createdHabit);
            // User.updateOne({ username: req.session.currentUser.username }, { $push: { habits: `ObjectId("${createdHabit['_id']}")` } }, (err, linkCreated) => {

            // create default false entries for a week
            for (let i = 0; i < 5; i++) {
                Entry.create({ habit_id: createdHabit['_id'] });
            }
            res.redirect('/habits/');
            // });
        }
    });
});

// entry
habits.patch('/:id/entry', (req, res) => {
    // req.body.habit_id = req.params.id;
    req.body.done = !req.body.done;
    console.log(req.body);
    // res.send(req.body);
    Entry.findByIdAndUpdate(req.params.id, { $set: { done: req.body.done } }, (err, result) => {
        res.redirect('/habits/');
    });
});

// router.patch('/:id', (req, res) => {
//     Product.findByIdAndUpdate(req.params.id, { $inc: { 'qty': -1 } }, (err, result) => {
//         res.redirect(`/products/${req.params.id}`);
//     });
// });


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