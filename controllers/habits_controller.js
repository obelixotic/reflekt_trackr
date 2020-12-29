const express = require("express");
const Habit = require("../models/habits_model.js");
// const User = require("../models/users_model.js");
const Entry = require("../models/entries_model.js");
const habits = express.Router();
const getDay = require("date-fns/getDay");
const addDays = require("date-fns/addDays");
const getWeek = require("date-fns/getWeek");
// const { getMonth } = require("date-fns");
const getDate = require("date-fns/getDate");
const getMonth = require("date-fns/getMonth");
// const subDays = require("date-fns/subDays");
// const isSameWeek = require("date-fns/isSameWeek");
// const isSameMonth = require("date-fns/isSameMonth");

// MIDDLEWARE
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect("/sessions/new");
    }
};

// ROUTES
// index
habits.get("/", (req, res) => {
    // res.send('Hello hello, I see you\'ve authenticated');
    if (req.session.currentUser) {
        // if authenticated
        let userHabits = Habit.find({
            user: req.session.currentUser.username,
        }).sort({ color: 1 });
        userHabits.exec((err, allHabits) => {
            // console.log(allHabits);
            if (allHabits.length == 0) {
                res.render("habits/index.ejs", {
                    habits: "",
                    currentUser: req.session.currentUser,
                    entries: "",
                    tabTitle: "Home",
                    sundayDate: getDate(lastDateOfEntry - 86400000 * 6),
                    sundayMonth: getMonth(lastDateOfEntry - 86400000 * 6) + 1,
                    mondayDate: getDate(lastDateOfEntry - 86400000 * 5),
                    mondayMonth: getMonth(lastDateOfEntry - 86400000 * 5) + 1,
                    tuesdayDate: getDate(lastDateOfEntry - 86400000 * 4),
                    tuesdayMonth: getMonth(lastDateOfEntry - 86400000 * 4) + 1,
                    wednesdayDate: getDate(lastDateOfEntry - 86400000 * 3),
                    wednesdayMonth: getMonth(lastDateOfEntry - 86400000 * 3) + 1,
                    thursdayDate: getDate(lastDateOfEntry - 86400000 * 2),
                    thursdayMonth: getMonth(lastDateOfEntry - 86400000 * 2) + 1,
                    fridayDate: getDate(lastDateOfEntry - 86400000 * 1),
                    fridayMonth: getMonth(lastDateOfEntry - 86400000 * 1) + 1,
                    saturdayDate: getDate(lastDateOfEntry),
                    saturdayMonth: getMonth(lastDateOfEntry) + 1,
                });
            }

            let todaysDate = Date.now(); //46 0
            // let todaysDate = 1605846664602; //47 4
            // let todaysDate = 1606346664602; //48 3

            let promArray = [];
            for (habit of allHabits) {
                //sort date wise first
                let query = Entry.find({ habit_id: habit._id }).sort({ date: 1 });
                const prom = query.exec();
                promArray.push(prom);
            }

            Promise.all(promArray).then((allEntries) => {
                //lets check if the week has changed
                let diffInWeeks = 0;
                let lastDateOfEntry = allEntries[0][allEntries[0].length - 1].date;
                // console.log(allEntries);
                console.log(
                    "lastDateOfEntry: ",
                    lastDateOfEntry,
                    "week:",
                    getWeek(lastDateOfEntry)
                );
                // console.log("todaysDate: ", todaysDate, "week:", getWeek(todaysDate));
                diffInWeeks = getWeek(todaysDate) - getWeek(lastDateOfEntry);
                // console.log("difference in weeks: ", diffInWeeks);

                // if logging-in on a different week
                if (diffInWeeks != 0) {
                    if (diffInWeeks < 0) {
                        diffInWeeks = diffInWeeks + 52; //if the year has changed since
                    }
                    console.log("entered conditional loop: \n");
                    firstDayForEntry = addDays(lastDateOfEntry, 1); //1
                    console.log(firstDayForEntry);
                    let promArray2 = [];
                    for (habit of allHabits) {
                        for (let i = 0; i < 7 * diffInWeeks; i++) {
                            let entryDate = addDays(firstDayForEntry, i);
                            console.log(entryDate);
                            let prom2 = Entry.create({
                                habit_id: habit["_id"],
                                date: entryDate,
                            });
                            promArray2.push(prom2);
                        }
                    }
                    Promise.all(promArray2).then((createdEntries) => {
                        console.log(createdEntries); //the newly created 7 entries
                        res.render("habits/index.ejs", {
                            habits: allHabits,
                            currentUser: req.session.currentUser,
                            entries: [createdEntries],
                            tabTitle: "Home",
                        });
                    });
                } else {
                    // if logging-in on the same week
                    let weeksEntries = [];
                    for (entries of allEntries) {
                        entries = entries.slice(entries.length - 7); //last 7 are the latest entries
                        // entries = entries.splice(7, 7);
                        weeksEntries.push(entries);
                    }
                    // console.log(weeksEntries);
                    res.render("habits/index.ejs", {
                        habits: allHabits,
                        currentUser: req.session.currentUser,
                        entries: weeksEntries,
                        tabTitle: "Home",
                        sundayDate: getDate(lastDateOfEntry - 86400000 * 6),
                        sundayMonth: getMonth(lastDateOfEntry - 86400000 * 6) + 1,
                        mondayDate: getDate(lastDateOfEntry - 86400000 * 5),
                        mondayMonth: getMonth(lastDateOfEntry - 86400000 * 5) + 1,
                        tuesdayDate: getDate(lastDateOfEntry - 86400000 * 4),
                        tuesdayMonth: getMonth(lastDateOfEntry - 86400000 * 4) + 1,
                        wednesdayDate: getDate(lastDateOfEntry - 86400000 * 3),
                        wednesdayMonth: getMonth(lastDateOfEntry - 86400000 * 3) + 1,
                        thursdayDate: getDate(lastDateOfEntry - 86400000 * 2),
                        thursdayMonth: getMonth(lastDateOfEntry - 86400000 * 2) + 1,
                        fridayDate: getDate(lastDateOfEntry - 86400000 * 1),
                        fridayMonth: getMonth(lastDateOfEntry - 86400000 * 1) + 1,
                        saturdayDate: getDate(lastDateOfEntry),
                        saturdayMonth: getMonth(lastDateOfEntry) + 1,
                    });
                }
            });
        });
    } else {
        // if not authenticated
        res.render("habits/index.ejs", {
            habits: "",
            currentUser: "",
            entries: "",
            tabTitle: "Home",
        });
    }
});

// new
habits.get("/new", isAuthenticated, (req, res) => {
    // res.send('new');
    res.render("habits/new.ejs", {
        tabTitle: "New habit",
        currentUser: req.session.currentUser,
    });
});

//create
habits.post("/", isAuthenticated, (req, res) => {
    if (
        req.body.name == "" ||
        (req.body.name.split(" ")[0] == "" && req.body.name.split(" ")[1] == "")
    ) {
        res.redirect("/habits/new");
    } else {
        req.body.done = false;
        req.body.user = req.session.currentUser.username;
        req.body.name =
            req.body.name.toLowerCase().charAt(0).toUpperCase() +
            req.body.name.toLowerCase().slice(1);
        // req.body.category = req.body.category.toLowerCase().charAt(0).toUpperCase() + req.body.category.toLowerCase().slice(1);
        req.body.date = Date.now();
        // if (req.body.color == 'white') {
        //     req.body.color = 'grey';
        // }
        console.log(req.body);
        Habit.create(req.body, (err, createdHabit) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(createdHabit);
                // adding dates to each entry
                let creationDate = Date.now();
                let creationDayOfWeek = getDay(creationDate);

                // create default false entries for a week
                let promArray = [];
                for (let i = 0; i < 7; i++) {
                    let diff = i - creationDayOfWeek;
                    let entryDate = addDays(creationDate, diff);
                    console.log(entryDate);
                    let prom = Entry.create({
                        habit_id: createdHabit["_id"],
                        date: entryDate,
                    });
                    promArray.push(prom);
                }
                Promise.all(promArray).then((allEntries) => {
                    res.redirect("/habits/");
                });
            }
        });
    }
});

// make a daily entry
habits.patch("/:id/entry", isAuthenticated, (req, res) => {
    // req.body.habit_id = req.params.id;
    if (req.body.done === "false") {
        req.body.done = true;
    } else {
        req.body.done = false;
    }
    console.log(req.body);
    // res.send(req.body);
    Entry.findByIdAndUpdate(
        req.params.id, { $set: { done: req.body.done } },
        (err, result) => {
            if (req.body.redirectToShow == "true") {
                res.redirect(`/habits/${req.body.habit_id}`);
            } else {
                res.redirect("/habits/");
            }
        }
    );
});

// show
habits.get("/:id", isAuthenticated, (req, res) => {
    // res.send(`show ${req.params.id}`);
    Habit.findById(req.params.id, (err, foundHabit) => {
        // let query = Entry.find({ habit_id: foundHabit._id }, (err, habitEntries) => {
        //     // console.log('habitEntries: ', habitEntries);
        // });
        let query = Entry.find({ habit_id: foundHabit._id }).sort({ date: 1 });

        // let thisMonth = getMonth(Date.now());

        const prom = query.exec();
        prom.then((allEntries) => {
            // console.log(allEntries);
            res.render("habits/show.ejs", {
                tabTitle: foundHabit.name,
                currentUser: req.session.currentUser,
                habit: foundHabit,
                id: req.params.id,
                entries: allEntries,
                // months: ['December', 'November', 'October', 'September']
                // currentMonth: thisMonth,
                // months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].splice((12 - thisMonth + 5), 4)
            });
        });
    });
});

// edit
habits.get("/:id/edit", isAuthenticated, (req, res) => {
    // res.send(`edit ${req.params.id}`);
    Habit.findById(req.params.id, (err, foundHabit) => {
        console.log(foundHabit);
        res.render("habits/edit.ejs", {
            tabTitle: "Edit habit",
            currentUser: req.session.currentUser,
            habit: foundHabit,
            id: req.params.id,
        });
    });
});

// update
habits.put("/:id", isAuthenticated, (req, res) => {
    console.log(req.body);
    // res.send(`update ${req.params.id}`);
    req.body.name =
        req.body.name.toLowerCase().charAt(0).toUpperCase() +
        req.body.name.toLowerCase().slice(1);
    // req.body.category = req.body.category.toLowerCase().charAt(0).toUpperCase() + req.body.category.toLowerCase().slice(1);
    // if (req.body.color == 'white') {
    //     req.body.color = 'zblack';
    // }
    Habit.findByIdAndUpdate(
        req.params.id, {
            $set: {
                name: req.body.name,
                category: req.body.category,
                color: req.body.color,
                icon: req.body.icon,
            },
        },
        (err, result) => {
            res.redirect(`/habits/`);
        }
    );
});

// delete
habits.delete("/:id", isAuthenticated, (req, res) => {
    // res.send(`delete ${req.params.id}`);
    Habit.findByIdAndDelete(req.params.id, (err, toDeleteHabit) => {
        Entry.deleteMany({ habit_id: toDeleteHabit._id },
            (err, toDeleteEntries) => {
                res.redirect("/habits");
            }
        );
    });
});

module.exports = habits;