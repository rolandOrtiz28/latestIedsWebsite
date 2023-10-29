const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');

router.get('/sidebar', async (req, res) => {
    const students = await Registration.find({})
    
   res.render('studentsearch/sidebar', { students });
})

router.get('/student/:id', catchAsync(async (req, res) => {
    const student = await Registration.findById(req.params.id).populate('fee').populate('grade');
    
    res.render('studentsearch/show', { student });
}))

router.get('/sidebar/security/:id', async (req, res) => {
    const studentId = req.params.id;
    // Render the security check form with the studentId
    res.render('studentsearch/security', { studentId });
});

router.post('/sidebar/security/:id', catchAsync(async (req, res) => {
    try {
        const enteredStudentNumber = req.body.studentNumber;
        const studentId = req.params.id;

        const student = await Registration.findById(studentId);

        if (student && student.student.studentNumber === enteredStudentNumber) {
            res.redirect(`/student/${student._id}`);
        } else {
            req.flash('error', 'Invalid student number. Please enter the correct information.');
            return res.redirect(`/sidebar/security/${studentId}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}));
module.exports = router