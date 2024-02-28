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
    group:["Spot.id","SpotImages.id"]


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
group:["Spot.id", "SpotImages.id"]


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

router.get("/:spotId", async(req, res, next) => {
    const id =parseInt(req.params.spotId)
    // if spot id exist return full details about that spot
    if(await Spot.findByPk(id)){
        const spotWithId =  await Spot.findByPk(id,{
            include: [{
                model: Review,
                attributes: []
                },
                {
                    model: SpotImage,
                    attributes:["preview", "url"]
                },
                {
                    model: User,
                    as: "Owner",
                    attributes: ["id","firstName", "lastName"]
                }
        ],
        
                attributes: {
                    include: [
                        [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
                        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"]
                    ]
            },
            group:["Spot.id","SpotImages.id", "Owner.id"]
        

        })
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