
const router = require("express").Router();
const { requireAuth } = require("../../utils/auth");
const { SpotImage, Spot } = require("../../db/models")


router.delete("/:imageId",requireAuth, async(req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId);
    console.log(image)
    if(image){
        const spot = await Spot.findByPk(image.spotId);
        console.log(spot)
        if(spot && spot.ownerId === req.user.id){
           await image.destroy();
            return res.json({message: "Successfully deleted"})
        }
        else{
            return res.status(404).json({message: "Spot Image couldn't be found"})
        }
    }
    else{
        return res.status(404).json({message: "Spot Image couldn't be found"})
    }


})
module.exports = router