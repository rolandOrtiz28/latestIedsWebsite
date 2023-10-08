const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Registration = require('../model/registration');
const Fee = require('../model/fee')



// router.get('/payment/:id', catchAsync(async(req,res)=>{
//     const studentId = req.params.id.trim(); // Remove leading/trailing spaces
// const student = await Registration.findById(studentId).populate('fee');
// console.log(student)
//     res.render('students/payment', {student})

// }))

router.get('/payment/:id', catchAsync(async (req, res) => {
    const studentId = req.params.id.trim(); // Remove leading/trailing spaces
    const student = await Registration.findById(studentId).populate('fee');
    
    // Generate a random invoice number
    const invoiceNumber = generateRandomInvoiceNumber();
    
    // Save the invoice number to the student record in the database
    student.invoiceNumber = invoiceNumber;
    await student.save();
    
   
    res.render('students/payment', { student });
  }));
  
  // Function to generate a random invoice number
  function generateRandomInvoiceNumber() {
    
    const currentDate = new Date();
    const randomPart = Math.floor(Math.random() * 10000); // Change this as needed
    const invoiceNumber = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}-${randomPart}`;
    return invoiceNumber;
  }
  

module.exports = router