const router = require("express").Router();
const { restoreUser } = require("../../utils/auth");
const sessionRouter = require("./session")
const usersRouter = require("./users");
const spotsRouter = require("./spots")
const reviewRouter = require("./reviews")
const bookingsRouter = require("./booking")



//Connect restoreUser middleware to the API router
    //If curent user session is valid, set req.user to the use in the database
    // if the current user session is not valid, set req.user to null
router.use(restoreUser)

router.use("/session", sessionRouter)

router.use("/users", usersRouter)

router.use("/spots",spotsRouter )

router.use("/reviews",reviewRouter)


router.use("/bookings", bookingsRouter)



module.exports = router