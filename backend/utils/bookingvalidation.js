
const router = require("express").Router({mergeParams:true})
const { format } = require("date-fns");
const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("./validation");

const dateFormated = (date) => {
    let  newDate = format(new Date(date), "yyyy-MM-dd");
     return newDate
 
 }
 const getDateOnly = (date) => {
     let newDate = dateFormated(date)
     let dateOnly = new Date(newDate).getTime()
     return dateOnly
 }

const bookingsValidation = [
    check("startDate")
    .custom((value) =>{
        const now = getDateOnly(new Date())
        const startDate  = getDateOnly(value);
        if( now > startDate){
            throw new Error("startDate cannot be in the past")
        }
        return true
    

    }),
    check("endDate")
    .custom((value, {req}) => {
        const endDate = getDateOnly(value);
        const startDate = getDateOnly(req.body.startDate)
        if(endDate  <= startDate){
            throw new Error("endDate cannot be on or before startDate")
        }
        // passing the validation
        return true

    }),
   
    handleValidationErrors
]
module.exports = { bookingsValidation, dateFormated, getDateOnly }