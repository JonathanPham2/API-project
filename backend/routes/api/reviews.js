const express = require("express");
const router = express.Router();
const { User, Review, Spot , ReviewImage,SpotImage} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const review = require("../../db/models/review");









router.get("/current", requireAuth, async(req, res, next) => {
    //retrieving current user id
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: {
             userId
        },
        include: [
            {
                model: User,
                attributes: ["id","firstName", "lastName"]
                
            },
            {
                model: Spot,
                attributes: ["id","ownerId", "address", "city", "state", "country", "lat","lng", "name", "price"],
                include: [
                    {
                        model: SpotImage,
                        attributes: ["url"],
                        where: {preview: true},
                        limit: 1

                }
            ]
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }

            
        ] 
    })

    reviewPreviewImg = reviews.map(review => {
        const reviewObj = review.toJSON()
        // console.log(reviewObj)

        const previewImage = reviewObj.Spot.SpotImages[0].url

        // console.log(previewImage)
        reviewObj.Spot.previewImage = previewImage
        delete reviewObj.Spot.SpotImages
        return reviewObj
    })


    res.json({Reviews:reviewPreviewImg})

})
router.post("/:reviewId/images", requireAuth,async(req, res ,next ) => {
    const { url } = req.body
    const review =   await Review.findByPk(req.params.reviewId);
    if(review &&review.userId === req.user.id){
    
        const reviewImg = await ReviewImage.findAll({
            where:{
                reviewId: review.id
            }
        })
        if(reviewImg.length >=10 ) {
            return res.status(403).json({message: "Maxium number of images for this resource was reached"})
        }
        console.log(reviewImg.length)
    
        const img =  await review.createReviewImage({
            url

        })
        return res.json(img)
    }
    else {
        return res.status(400).json({message: "Review couldn't be found"})
        
    }
});
const validateReview = [
    check("review")
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
    check("stars")
    .isInt({min: 1, max: 5})
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

router.put("/:reviewId",requireAuth,validateReview, async (req, res, next) => {
    const userId = req.user.id;
    const reviewToUpdate = await Review.findByPk(req.params.reviewId);
    if(reviewToUpdate && reviewToUpdate.userId === userId){

        const { review, stars } = req.body;
        reviewToUpdate.update({
            review,
            stars

        })
        return res.json(reviewToUpdate)
    }
    else {
        return res.status(404).json({message: "Review couldn't found"})
    }

})

router.delete("/:reviewId", requireAuth, async (req, res, next)=> {
    const userId = req.user.id;
    const reviewToDelete = await Review.findByPk(req.params.reviewId);
    if(reviewToDelete && reviewToDelete.userId === userId) {
         await reviewToDelete.destroy();
        return res.json({message: "Successfully deleted"})
    }
    else {
        return res.status(404).json({message: "Review couldn't be found"})
    }

})



module.exports  = router