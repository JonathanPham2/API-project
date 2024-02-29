const router = require("express").Router()
const { Spot, User  } = require("../../db/models") ;
const { requireAuth } = require("../../utils/auth");


// router.get("/current", requireAuth, async(req, res, next) => {
//     const userId = req.user.id;
//     const bookings = await 


// })


module.exports = router


