const express = require("express");
const router = express.Router({mergeParams: true });
const { User, Review, Spot , ReviewImage,SpotImage} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.get("/",async (req, res, next ) => {
    
    const spot = await Spot.findByPk(req.params.spotId)
    if(spot){
    const review = await spot.getReviews({
        include: [
            {
            model: User,
            attributes:["firstName", "lastName"]
        },
        {
            model: ReviewImage,
            attributes: ["id","url"]
        }
    ]
    })
    res.json({Review: review})
}
    else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }


})
    const validateReview = [
        check("review")
        .exists({checkFalsy: true})
        .withMessage("Review text is required"),
        check("stars")
        .isInt({min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
        handleValidationErrors
]

router.post("/",requireAuth,validateReview, async (req,res, next) => {
    //retrieve info from req body
    const { review,stars } = req.body;
    
    
    const spot = await Spot.findByPk(req.params.spotId);
    if(spot){
        const allReviews  = await spot.getReviews();
     if(allReviews.find(review => review.userId === req.user.id)) {
            return res.status(500).json({message: "User already has a review for this spot"})
        }
       
    const spotReview = await  spot.createReview({
        userId: req.user.id,
        review,
        stars
    })
    res.json(spotReview)
    }
    else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
})


module.exports = router