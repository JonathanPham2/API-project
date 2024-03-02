const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User} = require("../../db/models")
const sequelize =  require("sequelize")
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check, query} = require("express-validator");
const { Op} = require("sequelize")



queryValidation = [
    query("page")
    .optional()
    .isInt({min: 1, max: 10})
    .withMessage("Page must be greate than or equal to 1"),
    query("size")
    .optional()
    .isInt({ min: 1, max: 20})
    .withMessage("Size must be greate than or equal to 1"),
    query('minLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Minimum latitude is invalid'),
    query('maxLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Maximum latitude is invalid'),
    query('minLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Minimum longitude is invalid'),
    query('maxLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Maximum longitude is invalid'),
    query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
    query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors


]


router.get("/",queryValidation,async(req,res, next) => {

    let where = {}
    let pagination ={}
    
    let page = parseInt(req.query.page) || 1
    let size = parseInt(req.query.size) || 20    

    pagination.limit = parseInt(size)
    pagination.offset = parseInt(size) * (parseInt(page) - 1)
    console.log(pagination)
     
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    if(minLat && maxLat) {
        where.lat = {[Op.between]: [minLat, maxLat]}
    }
    if(minLng && maxLng) {
        where.lng = {[Op.between]: [minLng, maxLng]}
    }
    if(minPrice && maxPrice) {
        where.price = {[Op.between]: [minPrice, maxPrice]}
    }


    
    const spots = await Spot.findAll({
        where,
        ...pagination,
        include: [{
        model: Review,
        attributes: ["stars"]
        },
        {
            model: SpotImage,
            attributes:["preview", "url"]
        }
],


    })
    const spotsWithPreImg = spots.map(spot => {
        let avgRating = "Rate me"
        const spotObj = spot.toJSON();
        if(spotObj.Reviews && spotObj.Reviews.length > 0){
            const totalStars = spotObj.Reviews.reduce((acc, review)=> acc + review.stars, 0 );
            avgRating = parseFloat((totalStars / spotObj.Reviews.length).toFixed(2))

        }
        
        spotObj.avgRating = avgRating
        delete spotObj.Reviews
        
      
      const previewImage = spotObj.SpotImages.find(image => image.preview ===true)?.url;

        spotObj.previewImage = previewImage
        

        delete spotObj.SpotImages
        return spotObj
    })
    res.json({Spots: spotsWithPreImg,page, size })

   

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
    spotObj.avgRating = spotObj.avgRating === null ? "Rate me" : parseFloat(spotObj.avgRating);
    delete spotObj.SpotImages
    return spotObj
})

    

return res.json({Spots: userSpots})
    



});
//handle booking route with spotId
const spotBookingRouter = require("./spotsbooking")

router.use("/:spotId/bookings",spotBookingRouter)

// handle review  route with specify spotId
const spotReviewRouter = require("./spotreview")

router.use("/:spotId/reviews", spotReviewRouter)

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
                    attributes:["id","preview", "url"]
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
        const spotWithIdObj = spotWithId.toJSON();
           spotWithIdObj.avgRating = spotWithIdObj.avgRating === null ? "Rate me":parseFloat(spotWithIdObj.avgRating);


           spotWithIdObj.numReviews = spotWithIdObj.numReviews = parseFloat(spotWithIdObj.numReviews)
        
        res.json(spotWithIdObj)

    }
    else{
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }




})
const validateSpot = [
    check("address")
    .exists({checkFalsy: true})
    .withMessage("Stree address is required"),
    check("city")
    .exists({checkFalsy: true})
    .withMessage("City is required"),
    check("state")
    .exists({checkFalsy: true})
    .withMessage("state is required"),
    check("country")
    .exists({checkFalsy: true})
    .withMessage("Country is required"),
    check("lat")
    .exists({checkFalsy: true})
    .isFloat({ min: -90, max: 90})
    .withMessage("Latitude must be within -90 and 90",),
    check("lng")
    .exists({checkFalsy: true})
    .isFloat({ min: -180, max: 180})
    .withMessage("Longitude must be withion -180 and 180"),
    check("name")
    .exists({checkFalsy: true})
    .isLength({max: 50})
    .withMessage("Name must be less than 50 characters"),
    check("description")
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
    check("price")
    .exists({checkFalsy: true})
    .isNumeric()
    .isFloat({min: 0.01})
    .withMessage("Price per day must be a positive number"),
    handleValidationErrors
]

router.post("/",requireAuth,validateSpot, async (req, res, next )=> { 
    // retrieve all information in re.body
    const { address, city, state, country, lat, lng, name ,description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

  return  res.status(201).json(newSpot)


    


})
const validateOwnerSpot = async (req,res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if(spot){
        if(req.user.id === spot.ownerId){
        req.spot = spot
        return next()
        }
        else  return res.status(403).json({message:"Forbidden"})
    }
    else {
        return res.status(404).json({
            message:"Spot couldn't be found"
        })
    }
}

router.post("/:spotId/images", requireAuth,validateOwnerSpot, async(req, res, next) => {
    const { url, preview } = req.body

    const spot = req.spot;

    const newImage = await spot.createSpotImage({
        url,
        preview
    })
    const newImageObj = newImage.toJSON()
        delete newImageObj.createdAt
        delete newImageObj.updatedAt
        delete newImageObj.spotId
        
        
        res.json(newImageObj);

})
router.put("/:spotId", requireAuth,validateOwnerSpot,validateSpot, async(req, res, next) => {
    const { address, city, state, country, lat, lng, name ,description, price } = req.body;
    const spotToUpdate = req.spot;

    await spotToUpdate.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        
    })
    res.json(spotToUpdate)
    
 
})
router.delete("/:spotId", requireAuth, validateOwnerSpot, async(req, res, next)=> {

    const spotToDelete = req.spot;
    spotToDelete.destroy();
    res.json({
        message: "Successfully delete"
    })

})


module.exports = router