const dotenv = require('dotenv').config({ override: true });
const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')
const Admin = require('../model/admin')
const Update = require('../model/updates')
const nodemailer = require('nodemailer')
const Registration = require('../model/registration')
const Fee = require('../model/fee')
const moment = require('moment')
const Schedule = require('../model/schedule')
const { isLoggedIn } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const { cloudinary } = require('../cloudinary');
const Chart = require('chart.js'); // Import Chart.js


// Authentication Section
router.get('/adminregister', (req, res) => {
    res.render('admin/adminregister')
})

router.get('/adminlogin', (req, res) => {
    res.render('admin/adminlogin')
})


router.post('/register', catchAsync(async (req, res) => {

    try {
        const { email, username, password } = req.body;

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            req.flash('error', 'Password must contain at least one uppercase letter, one digit, and be at least 8 characters long');
            res.redirect('/adminregister');
            return;
        }
        const existingUsername = await Admin.findOne({ username })
        if (existingUsername) {
            req.flash('error', 'A user with the given username is already registered')
            return res.redirect('/adminregister')
        }
        const existingEmail = await Admin.findOne({ email })
        if (existingEmail) {
            req.flash('error', 'A user with the given email is already registered')
            return res.redirect('/adminregister')
        }
        const confirmPassword = req.body['confirm-password'];
        if (password !== confirmPassword) {
            req.flash('error', 'Password do not match');
            return res.redirect('/adminregister');
        } else {
            const admin = new Admin({ email, username });
            const registeredUser = await Admin.register(admin, password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', `Welcome Admin ${username}`)
                res.redirect('/')
            })

        }

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/adminlogin', keepSessionInfo: true }), catchAsync( async(req, res) => {
    req.flash('success', "Welcome Admin")
    res.redirect('/')
}))


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
})


// Content Section


// Students
router.get('/admin/students', isLoggedIn, catchAsync(async (req, res) => {
    try {
        const students = await Registration.find({}).populate('fee');

        res.render('admin/studentdashboard', { students });
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));

router.get('/admin/students/search', isLoggedIn, catchAsync(async (req, res) => {
    try {
        const searchValue = req.query.search;


        const students = await Registration.find({
            $or: [
                { 'student.firstName': { $regex: searchValue, $options: 'i' } },
                { 'student.lastName': { $regex: searchValue, $options: 'i' } }
            ]
        });

        // Create an object to store unique student names
        const uniqueNamesObject = {};

        // Filter out duplicate student names
        const uniqueStudents = students.filter(student => {
            const fullName = student.student.lastName + ' ' + student.student.firstName;
            if (!uniqueNamesObject[fullName]) {
                uniqueNamesObject[fullName] = true;
                return true;
            }
            return false;
        });


        res.json(uniqueStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));

router.get('/admin/students/:id', isLoggedIn,  catchAsync(async (req, res) => {
    try {
        const student = await Registration.findById(req.params.id).populate('fee');

        res.render('admin/studentdashboard', { student })
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));


router.put('/students/:id', upload.array('image'), isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const student = await Registration.findByIdAndUpdate(id, { ...req.body }, { new: true }); // Use { new: true } to get the updated document

    if (!student) {
        req.flash('error', 'Student not found');
        return res.redirect(`/admin/students`);
    }

    const imgs = req.files.map(i => ({ url: i.path, filename: i.filename }));
    student.images.push(...imgs);

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // Remove deleted images from the student.images array
        student.images = student.images.filter(image => !req.body.deleteImages.includes(image.filename));
    }

    await student.save();

    req.flash('success', 'Student updated');
    res.redirect(`/admin/students#nav-Approved`);
}));


router.put('/students/:id/update', catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const students = await Registration.findByIdAndUpdate(id, { status }, { new: true });

        res.json({ success: true, status: students.status, studentId: students._id });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false });
    }
}));

// router.put('/students/:id/feeUpdate', catchAsync(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { feeStatus } = req.body;

//         // Update the student's feeStatus in the database
//         const updatedStudent = await Registration.findByIdAndUpdate(id, { feeStatus }, { new: true });

//         res.json({ success: true, feeStatus: updatedStudent.feeStatus, studentId: updatedStudent._id });

//     } catch (err) {
//         console.log(err.message);
//         res.status(500).json({ success: false });
//     }
// }));


router.put('/students/:id/feeUpdate', catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { feeStatus } = req.body;

        // Update the student's feeStatus in the database
        const updatedStudent = await Registration.findByIdAndUpdate(id, { feeStatus }, { new: true });

        // Update the feeStatus for all fees associated with the student
        const updateResult = await Fee.updateMany({ _id: { $in: updatedStudent.fee } }, { status: feeStatus });

        

        res.json({ success: true, feeStatus: updatedStudent.feeStatus, studentId: updatedStudent._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}));

router.delete('/students/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Registration.findByIdAndDelete(id);

    res.redirect('/admin/students');
}))

router.put('/registrations/:registrationId/markPaid',  catchAsync(async (req, res) => {
    const registrationId = req.params.registrationId;

    try {
        // Find the registration by ID
        const registration = await Registration.findById(registrationId);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Check if the feeStatus is already "Paid" (to avoid unnecessary updates)
        if (registration.feeStatus !== 'Paid') {
            // Set the feeStatus to "Paid"
            registration.feeStatus = 'Paid';

            // Clear the fee array (assuming you want to delete all fee records)
            registration.fee = [];

            // Set the total amount to zero
            registration.totalAmount = 0;

            // Save the updated registration record
            await registration.save();

            return res.status(200).json({ message: 'Fee marked as Paid and total amount updated' });
        } else {
            return res.status(200).json({ message: 'Fee is already marked as Paid' });
        }
    } catch (error) {
        console.error('Error marking fee as Paid:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));



// Update Fee
router.put('/fees/:id//update', catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const fees = await Fee.findByIdAndUpdate(id, { status }, { new: true });

        res.json({ success: true, status: fees.status, studentId: fees._id });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false });
    }
}));


// SCHOOL CALENDAR
// router.get('/admin/calendar', isLoggedIn, catchAsync(async (req, res) => {
//     const currentDate = moment();
//     const year = currentDate.year();
//     let month = currentDate.month() + 1;


//     if (req.query.month) {

//         const requestedMonth = parseInt(req.query.month);


//         if (requestedMonth >= 1 && requestedMonth <= 12) {
//             month = requestedMonth;
//         }
//     }
//     const monthNames = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     const monthName = monthNames[month - 1];

//     const calendar = generateCalendarData(year, month)
//     const startDayOfWeek = 0;
//     const weeks = generateWeekCalendarData(year, month, startDayOfWeek);
//     const isMonthActive = req.query.tab !== 'week';
//     const isWeekActive = !isMonthActive;
//     const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
//     const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');
//     const schedules = await Schedule.find({ date: { $gte: firstDayOfMonth, $lte: endDay } });


//     res.render('admin/schoolCalendar', { year, month, monthName, calendar, weeks, isWeekActive, isMonthActive, schedules });
// }));

// function generateWeekCalendarData(year, month, startDayOfWeek) {
//     const calendar = [];

//     const currentDate = moment();
//     const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
//     const currentDay = currentDate.startOf('week').add(startDayOfWeek, 'days');

//     const week = [];
//     for (let i = 0; i < 7; i++) {
//         week.push({
//             day: currentDay.date(),
//             isCurrentMonth: currentDay.month() === firstDayOfMonth.month(),
//             isToday: currentDay.isSame(moment(), 'day')
//         });
//         currentDay.add(1, 'day');
//     }

//     calendar.push(week);

//     return calendar;
// }


// function generateCalendarData(year, month) {
//     const calendar = []

//     const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month')
//     const startDay = firstDayOfMonth.clone().startOf('week')
//     const endDay = firstDayOfMonth.clone().endOf('month').endOf('week')
//     let currentDay = startDay.clone();
//     while (currentDay.isSameOrBefore(endDay, 'day')) {
//         const week = [];
//         for (let i = 0; i < 7; i++) {
//             week.push({
//                 day: currentDay.date(),
//                 isCurrentMonth: currentDay.month() === firstDayOfMonth.month(),
//                 isToday: currentDay.isSame(moment(), 'day')
//             });
//             currentDay.add(1, 'day');
//         }
//         calendar.push(week);
//     }

//     return calendar;
// }
router.get('/admin/calendar', isLoggedIn, catchAsync(async (req, res) => {
    const currentDate = moment();
    let year = req.query.year ? parseInt(req.query.year) : currentDate.year();
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
    const isYearActive = req.query.tab === 'year';
    const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');
    const schedules = await Schedule.find({ date: { $gte: firstDayOfMonth, $lte: endDay } });
    const yearData = generateYearCalendarData(year);
    const startOfYear = moment({ year }).startOf('year');
    const endOfYear = moment({ year }).endOf('year');

    console.log('tab parameter in URL:', req.query.tab);

    // Check if isYearActive and isMonthActive are set correctly
    console.log('isYearActive:', isYearActive);
    console.log('isMonthActive:', isMonthActive);

    const events = await Schedule.find({ date: { $gte: startOfYear, $lte: endOfYear } });
    res.render('admin/schoolCalendar', { year, month, monthName, calendar, weeks, isWeekActive, isMonthActive, schedules, isYearActive: false, yearData, monthNames, events });
}));

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

function generateYearCalendarData(year) {
    const yearData = [];

    for (let month = 0; month < 12; month++) {
        const monthData = [];
        const firstDayOfMonth = moment({ year, month }).startOf('month');
        const daysInMonth = firstDayOfMonth.daysInMonth();

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = moment({ year, month, day });
            monthData.push({
                day,
                isCurrentMonth: true, // Assuming all days are in the current month
                isToday: currentDay.isSame(moment(), 'day')
                // Add more information as needed
            });
        }

        yearData.push(monthData);
    }

    return yearData;
}


// updates
router.get('/updates-dashboard', isLoggedIn, catchAsync(async (req, res) => {

    const updates = await Update.find({});
    res.render('admin/update-dashboard', { updates });

}));

router.put('/updates/:id', upload.array('image'), isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    const imgs = req.files.map(i => ({ url: i.path, filename: i.filename }));
    update.images.push(...imgs);
    await update.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await update.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await update.save();
    req.flash('success', 'update updated')
    res.redirect(`/updates-dashboard`)

}))


router.delete('/updates/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/updates-dashboard');
}))

// Stat

router.get('/analytics', catchAsync(async (req, res) => {
    try {
      
        const fees = await Fee.find({ status: "Paid" });
        const totalSales = fees.reduce((total, fee) => total + fee.amount, 0);
  
      const totalStudents = await Registration.countDocuments({});
      
      const monthlySalesData = await calculateMonthlySalesData();

      const monthlyStudentsData = await calculateMonthlyStudentsData();

      const stats = await Registration.aggregate([
        { $group: { _id: '$curriculum', count: { $sum: 1 } } }
    ]);

    const curriculumStats = {
        'Khmer Education Program': 0,
        'International English Program': 0,
        'Chinese Language Classes': 0,
        'General English Program': 0
    };

    stats.forEach(stat => {
        if (curriculumStats.hasOwnProperty(stat._id)) {
            curriculumStats[stat._id] = stat.count;
        }
    });
     
      res.render('admin/analytics', { totalSales, totalStudents, monthlySalesData, monthlyStudentsData, curriculumStats}); 
  
    } catch (error) {
      
      console.error(error);
      req.flash('error', 'Failed to fetch total sales');
      res.redirect('/admin/students');
    }
  }));

  async function calculateMonthlySalesData() {
    const currentYear = new Date().getFullYear();
    const monthlySalesData = Array.from({ length: 12 }, () => 0); // Initialize with zeros for each month
  
    // Filter fees with status "Paid"
    const fees = await Fee.find({ status: "Paid" });
  
    fees.forEach((fee) => {
      const feeDate = new Date(fee.createdAt);
      const feeMonth = feeDate.getMonth();
      const feeYear = feeDate.getFullYear();
  
      if (feeYear === currentYear) {
        monthlySalesData[feeMonth] += fee.amount;
      }
    });
  
    return monthlySalesData;
  }
  async function calculateMonthlyStudentsData() {
    const currentYear = new Date().getFullYear();
    const monthlyStudentsData = Array.from({ length: 12 }, () => 0); // Initialize with zeros for each month
    const students = await Registration.find({});
 
    students.forEach((student) => {
      const studentDate = new Date(student.createdAt);
      const studentMonth = studentDate.getMonth();
      const studentYear = studentDate.getFullYear();
      
      if (studentYear === currentYear) {
        monthlyStudentsData[studentMonth] += 1; // Increment the count for the month
      }
    });
  
    return monthlyStudentsData;
  }
  


module.exports = router;