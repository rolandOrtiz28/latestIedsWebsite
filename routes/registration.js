const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');


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



router.get('/pending', async (req, res) => {
    try {
        const pendingRegistrations = await Registration.find({ status: 'Pending' });
        res.render('students/pending', { pendingRegistrations });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

router.post('/student', catchAsync(async (req, res) => {
   await Registration.deleteMany({})
    const { firstName, lastName, age, address, gender, birthday } = req.body;
    // Set the studentNumber before restructuring
    const year = new Date().getFullYear();
    const studentCount = await Registration.countDocuments({ studentNumber: { $regex: `^${year}` } });
    const formattedCount = (studentCount + 1).toString().padStart(4, '0');
    req.session.registrationData.studentNumber = `IEDS${year}-${formattedCount}`;

    req.session.registrationData.student = {
        studentNumber: req.session.registrationData.studentNumber,
        firstName,
        lastName,
        age,
        address,
        gender,
        birthday,
        yearLevel: req.session.registrationData.yearLevel, // Add yearLevel here
    };

    res.redirect('/registrationformparentsinfo');

}));



router.post('/parents', (req, res) => {
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
});

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






module.exports = router