const router = require("express").Router();
const { restoreUser } = require("../../utils/auth");
const sessionRouter = require("./session")
const usersRouter = require("./users");



//Connect restoreUser middleware to the API router
    //If curent user session is valid, set req.user to the use in the database
    // if the current user session is not valid, set req.user to null
router.use(restoreUser)

router.use("/session", sessionRouter)

router.use("/users", usersRouter)


module.exports = router