const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');
const { isLoggedIn } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const { cloudinary } = require('../cloudinary');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');


router.get('/registrationform', catchAsync(async (req, res) => {
    
    req.session.registrationData = {
        student: {},
        parents: {},
        curriculum: ''
    };
    res.render('./students/registration', { registrationData: req.session.registrationData });
}));

router.get('/registrationformparentsinfo', catchAsync(async (req, res) => {
    res.render('./students/parents')
}))

router.get('/registrationformcurriculum', catchAsync(async (req, res) => {
    res.render('./students/curriculum')
}))

router.get('/students', async (req, res) => {

    const students = await Registration.find({})
   
   
    res.render('students/index', { students })
})



router.get('/pending',  catchAsync(async (req, res) => {
    try {
        const pendingRegistrations = await Registration.find({ status: 'Pending' });
        res.render('students/pending', { pendingRegistrations });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}));


router.post('/student', catchAsync(async (req, res) => {

    const { firstName, lastName, age, address, gender, birthday } = req.body;

    // Generate a random 5-digit student ID
    const studentId = generateRandomStudentId(5);

    req.session.registrationData.studentNumber = studentId;

    req.session.registrationData.student = {
        studentNumber: studentId,
        firstName,
        lastName,
        age,
        address,
        gender,
        birthday,
        yearLevel: req.session.registrationData.yearLevel,
    };

    res.redirect('/registrationformparentsinfo');
}));

// Function to generate a random student ID with the specified length
function generateRandomStudentId(length) {
    const characters = '0123456789';
    let studentId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        studentId += characters.charAt(randomIndex);
    }

    return `#IEDS${studentId}`;
}

router.post('/parents',  catchAsync(async(req, res) => {
    const { fatherName, motherName, fatherOccupation, motherOccupation, phoneNumber } = req.body;
    req.session.registrationData.parents = {
        fatherName,
        motherName,
        fatherOccupation,
        motherOccupation,
        phoneNumber,
    };
    req.session.registrationData.yearLevel = req.body.yearLevel; // Add yearLevel here
    res.redirect('/registrationformcurriculum');
}));

router.post('/curriculum', async (req, res) => {
    const { curriculum, yearLevel } = req.body;
    req.session.registrationData.curriculum = curriculum;
    req.session.registrationData.yearLevel = yearLevel;

    const newRegistration = new Registration(req.session.registrationData);
    await newRegistration.save();


    // Clear session data after registration is complete
    req.session.registrationData = null;

    res.redirect('/pending')
});

router.post('/adminStudent', upload.array('image'), catchAsync(async (req, res) => {
    // Generate a random 5-digit student ID
    const studentId = generateRandomStudentId(5);

    const studentData = {
        student: {
            studentNumber: studentId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            address: req.body.address,
            gender: req.body.gender,
            birthday: req.body.birthday
        },
        parents: {
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            motherOccupation: req.body.motherOccupation,
            fatherOccupation: req.body.fatherOccupation,
            phoneNumber: req.body.phoneNumber
        },
        curriculum: req.body.curriculum,
        yearLevel: req.body.yearLevel,
        status: req.body.status // Added status field
    };

    const student = new Registration(studentData);
    student.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    await student.save();
    req.flash('success', 'Student added')
    res.redirect(`/admin/students`);
}));

// Function to generate a random student ID with the specified length
function generateRandomStudentId(length) {
    const characters = '0123456789';
    let studentId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        studentId += characters.charAt(randomIndex);
    }

    return `#${studentId}`;
}


module.exports = router