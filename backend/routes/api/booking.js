const router = require("express").Router()
const { Spot, User, Booking, SpotImage  } = require("../../db/models") ;
const { requireAuth } = require("../../utils/auth");
const { dateFormated, bookingsValidation, getDateOnly } = require("../../utils/bookingValidation");
const {Op} = require("sequelize")



router.get("/current",requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId
        },
        include: {
            model: Spot,
            attributes: ["id","ownerId", "address", "city", "state", "country", "lat","lng", "name", "price"],
            include: {
                model: SpotImage,
                attributes: ["url"],
                where: {preview:true},
                limit: 1
            }

        }
        
    })
    const bookingsWithImg = bookings.map(booking => {
        const bookingObj = booking.toJSON();

        const previewImage = booking.Spot.SpotImages[0].url;
        bookingObj.Spot.previewImage = previewImage;
        bookingObj.startDate = dateFormated(bookingObj.startDate)
        bookingObj.endDate = dateFormated(bookingObj.endDate)
        delete bookingObj.SpotImages
        


        return{

            id: bookingObj.id,
            spotId: bookingObj.spotId,
            Spot: {
            id: bookingObj.Spot.id,
            ownerId: bookingObj.Spot.ownerId,
            address: bookingObj.Spot.address,
            city: bookingObj.Spot.city,
            state: bookingObj.Spot.state,
            country: bookingObj.Spot.country,
            lat: bookingObj.Spot.lat,
            lng: bookingObj.Spot.lng,
            name: bookingObj.Spot.name,
            price: bookingObj.Spot.price,
            previewImage: bookingObj.Spot.previewImage 
        },
             userId: bookingObj.userId,
            startDate: bookingObj.startDate,
            endDate: bookingObj.endDate,
            createdAt: bookingObj.createdAt,
            updatedAt: bookingObj.updatedAt

        }

        
    })



    res.json({Bookings:bookingsWithImg})


})
const isPastBooking =  async (req, res, next) => {
    const{startDate} = req.body
    const now =  new Date().getTime()
    if(getDateOnly(startDate) <= now){
        return res.json({message: "Past bookings can't be modified"})
    }
    next()


}


router.put("/:bookingId", requireAuth,isPastBooking,bookingsValidation, async(req, res, next ) =>{
    const bookingToUpdate =  await Booking.findByPk(req.params.bookingId);

    // if booking exist and belong to the current user then they can modify it
    if(bookingToUpdate && bookingToUpdate.userId === req.user.id){
        const {startDate, endDate } = req.body


        const spotBookings = await Booking.findAll({
            where: {
                spotId: bookingToUpdate.spotId,
                id: {
                    [Op.notIn]: [bookingToUpdate.id]

                }
                
            }
        })

        const bookingDatesFormated = spotBookings.map(booking => {
            const bookingObj = booking.toJSON();
            bookingObj.startDate = getDateOnly(bookingObj.startDate)
            bookingObj.endDate = getDateOnly(bookingObj.endDate)
            return bookingObj


        })
        

        const Booked = bookingDatesFormated.find(booking => 
                getDateOnly(startDate) >= booking.startDate &&
                getDateOnly(startDate) <= booking.endDate
            )
            
            if(Booked){
            const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status =403
                err.errors= {startDate: "Start date  conflicts with an existing booking"}
                return next(err)

            }
            const isEndDateConflict =bookingDatesFormated.find(booking => 
             getDateOnly(endDate) >= booking.startDate && getDateOnly(endDate) <= booking.endDate ||
             getDateOnly (startDate)<= booking.endDate && getDateOnly(endDate) >= booking.startDate)

            
            if(isEndDateConflict){
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403
                err.errors= {endDate:"End date conflicts with an existing booking"}
                return next(err)
                
            }
            


        



        await bookingToUpdate.update({
            startDate,
            endDate

        })
        const bookingObj = bookingToUpdate.toJSON()
        return res.json({
            id: bookingObj.id,
            spotId: bookingObj.spotId,
            userId: bookingObj.userId,
            startDate,
            endDate,
            createdAt: bookingObj.createdAt,
            updatedAt: bookingObj.updatedAt

        })

    }
    else {
        res.status(404).json({message: "Booking couldn't be found"})
    }
})

router.delete("/:bookingId",requireAuth, async(req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    let spot
    if(booking){
    spot =  await Spot.findByPk(booking.spotId)
  

    if( req.user.id === booking.userId ||req.user.id === spot.ownerId){
    
        if(getDateOnly(booking.startDate) <=now && getDateOnly(booking.endDate)>  now) {
            res.status(403).json({message: "Bookings that have been started can't be deleted"})
        }
        await booking.destroy()
        return res.json({
            message:"Successfully deleted"
        })
    }
    }
    else {
        res.status(400).json({message:"Booking couldn't be found"})
    }






})


module.exports = router


