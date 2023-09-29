const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');
const Grade = require('../model/grade')



router.post('/admin/students/:studentId/grades', catchAsync(async (req, res) => {
    try {
        const { studentId } = req.params;
        const { description, rating } = req.body;
        console.log('studentId:', studentId);
        console.log('description:', description);
        console.log('rating:', rating);

        // Find the student by ID
        const student = await Registration.findById(studentId);
        if (!student) {
            // Handle the case where the student is not found
            console.log('Student not found');
            req.flash('error', 'Student not found');
            return res.redirect('/admin/students');
          }

        const grade = new Grade({ description, rating });

        student.grade.push(grade);
console.log(student.grade)
        // Save the fee and the student
        await grade.save();
        await student.save();

        req.flash('success', 'Grade added successfully');
        res.redirect('/admin/students');
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        req.flash('error', 'Failed to add grade');
        res.redirect('/admin/students');
    }
}));


router.delete('/:gradeId', catchAsync(async(req,res)=>{
    const { id, gradeId } = req.params;
    await Registration.findByIdAndUpdate(id, { $pull: { grades: gradeId } })
    await Grade.findByIdAndDelete(gradeId);
    req.flash('success', 'grade Deleted')
    res.redirect(`/student/${id}`);

}))


module.exports = router