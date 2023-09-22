const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');

router.get('/sidebar', async (req, res) => {
    const students = await Registration.find({})

    res.render('/studentsearch/sidebar', { students })
})

router.get('/sidebar', async (req, res) => {
    const students = await Registration.find({})
    res.render('studentsearch/sidebar', { students, sidebarStudent: null }); // Pass the student data for the sidebar
})



module.exports = router