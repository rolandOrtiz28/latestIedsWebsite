const dotenv = require('dotenv').config({ override: true });
const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')
const Admin = require('../model/admin')
const nodemailer = require('nodemailer')
const Registration = require('../model/registration')


// Authentication Section
router.get('/adminregister', (req, res) => {
    res.render('admin/adminregister')
})

router.get('/adminlogin', (req, res) => {
    res.render('admin/adminlogin')
})


router.post('/register', catchAsync(async (req, res) => {
    await Admin.deleteMany({})
    try {
        const { email, username, password } = req.body;

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            req.flash('error', 'Password must contain at least one uppercase letter, one digit, and be at least 8 characters long');
            res.redirect('/register');
            return;
        }
        const existingUsername = await Admin.findOne({ username })
        if (existingUsername) {
            req.flash('error', 'A user with the given username is already registered')
            return res.redirect('/login')
        }
        const existingEmail = await Admin.findOne({ email })
        if (existingEmail) {
            req.flash('error', 'A user with the given email is already registered')
            return res.redirect('/login')
        }
        const confirmPassword = req.body['confirm-password'];
        if (password !== confirmPassword) {
            req.flash('error', 'Password do not match');
            return res.redirect('/login');
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

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/adminlogin', keepSessionInfo: true }), (req, res) => {
    req.flash('success', "Welcome Admin")
    res.redirect('/')
})


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
})


// Content Section


// Students
router.get('/admin/students', async (req, res) => {
    try {
        const students = await Registration.find({});
        res.render('admin/studentdashboard', { students });
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

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

router.delete('/students/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Registration.findByIdAndDelete(id);

    res.redirect('/admin/students');
}))


module.exports = router;