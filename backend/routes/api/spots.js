const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User} = require("../../db/models")
const sequelize =  require("sequelize")
const { requireAuth } = require("../../utils/auth");



// middlware that handling spots



router.get("/",async(req,res, next) => {
    const spots = await Spot.findAll({
        include: [{
        model: Review,
        attributes: []
        },
        {
            model: SpotImage,
            attributes:["preview", "url"]
        }
],
        
        attributes: {
            include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"]]
    },
    group:("Spot.id")


    })
    const spotsWithPreImg = spots.map(spot => {
        const spotObj = spot.toJSON();
      
      const previewImage = spotObj.SpotImages.find(image => image.preview ===true)?.url;

        spotObj.previewImage = previewImage
        delete spotObj.SpotImages
        return spotObj
    })
    res.json({Spots: spotsWithPreImg})

   

})

router.get("/current", requireAuth,async (req, res, next ) => {

   // get the current login user id

   const userId = req.user.id
   const spots = await Spot.findAll({
    where: {
        ownerId: userId
    },
    include: [{
    model: Review,
    attributes: []
    },
    {
        model: SpotImage,
        attributes:["preview", "url"]
    }
],
attributes: {
    include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"]]
},
group:("Spot.id")


})
const userSpots = spots.map(spot => {
    const spotObj = spot.toJSON();

    const previewImage = spotObj.SpotImages.find(image => image.preview ===true)?.url;

    spotObj.previewImage = previewImage
    delete spotObj.SpotImages
    return spotObj
})

    

return res.json({Spots: userSpots})
    



});
// // router.get("/test/:id", async(req,res,next)=> {
// //     let id = req.params.id
// //     let spot = await Spot.findByPk(id)
// //     let img = await spot.getSpotImages({where:{
// //         spotId: id
// //     }})
// //     res.json(img)
// //  })

// router.get("/:spotId",spotsObjHandler, async(req, res, next) => {
//     // retrieving all spots with full details

//     const spots = req.spots
//     // if spot id exist return full details about that spot
//     if(await Spot.findByPk(req.params.spotId)){
//         const spotWithId = spots.filter(spot => spot.id === parseInt(req.params.spotId))
//         // 
//         res.json(spotWithId)

//     }
//     else{
//         return res.status(400).json({
//             message: "Spot couldn't be found"
//         })
//     }




// })

// router.post("/", async (req, res, next )=> {


// })



module.exports = router