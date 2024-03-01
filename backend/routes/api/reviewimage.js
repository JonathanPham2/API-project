const router = require("express").Router();
const { requireAuth } = require("../../utils/auth");
const {Review, ReviewImage} = require("../../db/models")


router.delete("/:imageId", requireAuth, async(req, res, next)=> {

    const reviewImg = await ReviewImage.findByPk(req.params.imageId)

    if(reviewImg){
        // console.log(reviewImg)
        const review = await Review.findByPk(reviewImg.reviewId);
        console.log(review)
        if(review && review.userId === req.user.id){

            await reviewImg.destroy()
            return res.json({message:"Successfully deleted"})
        }
        else{
            return res.status(404).json({message: "Review Image couldn't be found"})
        }

    }
    else{
        return res.status(404).json({message: "Review Image couldn't be found"})
    }



})


module.exports = router;