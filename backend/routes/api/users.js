const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");

const { User } =  require ("../../db/models");

router.post("/", async(req, res, next) => {

    // descontruct credentials information from the body request
    const { username, email, password } = req.body;

    // hashing the provided password from user
    const hashedPassword = bcrypt.hashSync(password)
    // create new user in database
    newUser = await User.create({
        username: username,
        email: email,
        hashedPassword: hashedPassword
    })

    safeUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
    };
    setTokenCookie(res, safeUser)

    return res.json({
        user: 
            safeUser
        
    })


});

router.get("/",(req, res) => {

    // destructing user from request
    const { user } = req;
    // assuming restoreUser middleware alreay check..
    if(user) {
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        return res.json({
            user:safeUser
        })
    }
    else return res.json({user: null})
})


module.exports = router