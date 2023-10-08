const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');
const Fee = require('../model/fee')


router.post('/admin/students/:studentId/fees', catchAsync(async (req, res) => {
    try {
        const { studentId } = req.params;
        const { description, amount } = req.body;

        // Find the student by ID
        const student = await Registration.findById(studentId);
        if (!student) {
            // Handle the case where the student is not found
            console.log('Student not found');
            req.flash('error', 'Student not found');
            return res.redirect('/admin/students');
        }

        // Parse the amount as a number
        const feeAmount = parseFloat(amount);

        // Create a new fee
        const fee = new Fee({ description, amount: feeAmount });

        // Push the fee to the student's fees array
        student.fee.push(fee);

        // Update the totalAmount by adding the fee amount
        student.totalAmount += feeAmount;

        student.feeStatus = 'Pending';

        // Save the fee and the student
        await fee.save();
        await student.save();

        req.flash('success', 'Fee added successfully');
        res.redirect('/admin/students');
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        req.flash('error', 'Failed to add fee');
        res.redirect('/admin/students');
    }
}));



router.delete('/:feeId', catchAsync(async(req,res)=>{
    const { id, feeId } = req.params;
    await Registration.findByIdAndUpdate(id, { $pull: { fees: feeId } })
    await Fee.findByIdAndDelete(feeId);
    req.flash('success', 'fee Deleted')
    res.redirect(`/student/${id}`);

}))


module.exports = router