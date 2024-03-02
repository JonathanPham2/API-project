
const router = require("express").Router();
const { requireAuth } = require("../../utils/auth");
const { SpotImage, Spot } = require("../../db/models")


router.delete("/:imageId",requireAuth, async(req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId);
    if(image){
        const spot = await Spot.findByPk(image.spotId);
    
        if(spot && spot.ownerId === req.user.id){
           await image.destroy();
            return res.json({message: "Successfully deleted"})
        }
        else{
            return res.status(403).json({message: "Forbidden"})
        }
    }
    else{
        return res.status(404).json({message: "Spot Image couldn't be found"})
    }


})
module.exports = router