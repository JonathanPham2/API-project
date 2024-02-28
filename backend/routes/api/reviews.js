const express = require("express");
const router = express.Router();
const { User, Review, Spot , ReviewImage} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");


router.get("/current", requireAuth, async(req, res, next) => {
    //retrieving current user id
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: User,
                attributes: ["id","firstName", "lastName"]
                
            },
            {
                model: Spot,
                at
            }

            
        ] 
    })

})



module.exports  = router