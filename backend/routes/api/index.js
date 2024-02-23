const router = require("express").Router();
const { restoreUser } = require("../../utils/auth");


//Connect restoreUser middleware to the API router
    //If curent user session is valid, set req.user to the use in the database
    // if the current user session is not vcalid, set req.user to null
router.use(restoreUser)



module.exports = router