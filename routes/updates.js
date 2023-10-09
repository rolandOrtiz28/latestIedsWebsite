const express = require('express');
const router = express.Router();
const Update = require('../model/updates');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const { cloudinary } = require('../cloudinary');
const mongoosePaginate = require('mongoose-paginate-v2');
const { addLoadingVariable } = require('../middleware')
const nodemailer = require('nodemailer')
const catchAsync = require('../utils/CatchAsync')
const moment = require('moment')
const Schedule = require('../model/schedule')

router.get('/updates', catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const options = {
        sort: { createdAt: 'desc' },
        page: page,
        limit: pageSize
    };

    // Fetch the latest update
    const latestUpdate = await Update.findOne({}, {}, { sort: { createdAt: -1 } });

    if(!latestUpdate){
res.render('updates/index', {latestUpdate: null, previousUpdates:[]})
return

    }

    // Fetch the four previous updates (excluding the latest one)
    const previousUpdates = await Update.find({ _id: { $ne: latestUpdate._id } }, {}, options).limit(4);

    res.render('updates/index', { latestUpdate, previousUpdates });
}));





router.get('/new', (req, res) => {
    res.render('articles/new');

})

router.post('/newUpdates', upload.array('image'), catchAsync(async (req, res) => {
    try {
        const update = new Update(req.body.update);
        update.images = req.files.map(i => ({ url: i.path, filename: i.filename }));
        const saveupdate = update.save();

        // Wait for the update to be saved, then redirect
        await saveupdate;
        req.flash('success', "Successfully added a new Update")
        res.redirect('/updates-dashboard');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
}));




router.get('/updates/:id', catchAsync(async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('updates/show', { update });

}))

router.get('/schoolcalendar',  catchAsync(async (req, res) => {

    const currentDate = moment();
    const year = currentDate.year();
    let month = currentDate.month() + 1;


    if (req.query.month) {

        const requestedMonth = parseInt(req.query.month);


        if (requestedMonth >= 1 && requestedMonth <= 12) {
            month = requestedMonth;
        }
    }
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1];

    const calendar = generateCalendarData(year, month)
    const startDayOfWeek = 0;
    const weeks = generateWeekCalendarData(year, month, startDayOfWeek);
    const isMonthActive = req.query.tab !== 'week';
    const isWeekActive = !isMonthActive;
    const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');
    const schedules = await Schedule.find({ date: { $gte: firstDayOfMonth, $lte: endDay } });



    res.render('calendar/homecalendar', { year, month, monthName, calendar, weeks, isWeekActive, isMonthActive, schedules })
}))

function generateWeekCalendarData(year, month, startDayOfWeek) {
    const calendar = [];

    const currentDate = moment();
    const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
    const currentDay = currentDate.startOf('week').add(startDayOfWeek, 'days');

    const week = [];
    for (let i = 0; i < 7; i++) {
        week.push({
            day: currentDay.date(),
            isCurrentMonth: currentDay.month() === firstDayOfMonth.month(),
            isToday: currentDay.isSame(moment(), 'day')
        });
        currentDay.add(1, 'day');
    }

    calendar.push(week);

    return calendar;
}


function generateCalendarData(year, month) {
    const calendar = []

    const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month')
    const startDay = firstDayOfMonth.clone().startOf('week')
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week')
    let currentDay = startDay.clone();
    while (currentDay.isSameOrBefore(endDay, 'day')) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push({
                day: currentDay.date(),
                isCurrentMonth: currentDay.month() === firstDayOfMonth.month(),
                isToday: currentDay.isSame(moment(), 'day')
            });
            currentDay.add(1, 'day');
        }
        calendar.push(week);
    }

    return calendar;
}







module.exports = router;