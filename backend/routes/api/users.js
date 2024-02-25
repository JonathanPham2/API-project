const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");

const { User } =  require ("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");


//validate signun middleware

const validateSignup = [
    check("email")
    .exists({checkFalsy: true})
    .isEmail()
    .withMessage("Please provide valid email."),
    check("username")
    .exists({checkFalsy: true})
    .isLength({ min : 4})
    .withMessage("Please provide a username with at least 4 characters"),
    check("username")
    .not()
    .isEmail()
    .withMessage("Username can not be an email."),
    check("firstName")
    .exists({checkFalsy: true})
    .isLength({min: 4})
    .withMessage("Please provide your first name"),
    check("lastName")
    .exists({checkFalsy: true})
    .isLength({ min: 4})
    .withMessage(" Please provide your last name"),
    check("password")
    .exists({checkFalsy: true})
    .isLength({ min: 6})
    .withMessage("Password must be 6 characters or more"),
    handleValidationErrors
]

router.post("/",validateSignup, async(req, res, next) => {

    // descontruct credentials information from the body request
    const { username, email, firstName, lastName, password } = req.body;

    // hashing the provided password from user
    const hashedPassword = bcrypt.hashSync(password)
    // create new user in database
    newUser = await User.create({
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        hashedPassword: hashedPassword
    })

    safeUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username
    };
    setTokenCookie(res, safeUser)

    return res.json({
        user: 
            safeUser
        
    })


});




module.exports = router