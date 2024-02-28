const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User} = require("../../db/models")
const sequelize =  require("sequelize")
const { requireAuth } = require("../../utils/auth");
const spot = require("../../db/models/spot");

// middlware that handling spots
const spotsObjHandler = async (req, res, next) => {
    const spots= await Spot.findAll({
        include:[
            {
                model: Review,
                attributes: []
            },
        {
            model: SpotImage,
            attributes: [ "id", "url", "preview"],
           
        },
        {
            model: User,
            as:"Owner",
            attributes: ["id", "firstName", "lastName"]
        }
],
        
        attributes: {
            include: [
                // using sqeuelize literal to count and calculate avg
                [sequelize.literal(`(SELECT COUNT(*) FROM saigon_lodgings. "Reviews" 
                WHERE "spotId" = Spot.id)`), "numReviews"],

                [sequelize.literal(`(SELECT AVG(stars) FROM saigon_lodgings "Reviews" WHERE spotId = Spot.id)`), "avgRating"]
                
                
            ]

    }})
    // spots with all the details 
    req.spots = spots


    const spotsPreImg = spots.map(  spot => {
        
      
        // turn into POJO
      let spotObj = spot.toJSON();
      
      

      const previewImage = spotObj.SpotImages.find(image => image.preview === true)?.url;

      spotObj.previewImage = previewImage
      
      
      delete spotObj.SpotImages
      delete spotObj.Owner
      delete spotObj.numReviews

    
        

      return spotObj



    })
    // spots with avg and preimg only 
    req.spotsPreImg = spotsPreImg

    next()
}



router.get("/", spotsObjHandler,async(req,res, next) => {
   spotsPreImg = req.spotsPreImg
    

    return res.json({Spots: spotsPreImg})

})

router.get("/current", requireAuth, spotsObjHandler,async (req, res, next ) => {

   // get the current login user id

   const userId = req.user.id

   // retrieved spots form req
    const spotsPreImg = req.spotsPreImg

    // filter out spot with userId
    const userSpots = spotsPreImg.filter(spot => spot.ownerId === userId)
    

return res.json({Spots: userSpots})
    



});
// router.get("/test/:id", async(req,res,next)=> {
//     let id = req.params.id
//     let spot = await Spot.findByPk(id)
//     let img = await spot.getSpotImages({where:{
//         spotId: id
//     }})
//     res.json(img)
//  })

router.get("/:spotId",spotsObjHandler, async(req, res, next) => {
    // retrieving all spots with full details

    const spots = req.spots
    // if spot id exist return full details about that spot
    if(await Spot.findByPk(req.params.spotId)){
        const spotWithId = spots.filter(spot => spot.id === parseInt(req.params.spotId))
        // 
        res.json(spotWithId)

    }
    else{
        return res.status(400).json({
            message: "Spot couldn't be found"
        })
    }




})

// router.post("/", async (req, res, next )=> {


// })



module.exports = router