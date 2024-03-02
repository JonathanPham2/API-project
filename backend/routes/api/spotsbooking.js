const router = require("express").Router({mergeParams:true})
const { Spot, User, Booking, SpotImage  } = require("../../db/models") ;
const { requireAuth } = require("../../utils/auth");

const { bookingsValidation,dateFormated, getDateOnly } = require("../../utils/bookingvalidation");



router.get("/", requireAuth, async (req, res, next )=>{
    // fetch the spot with specific id
    const spot = await Spot.findByPk(req.params.spotId);
    //checking if the current user is the owner of the spot
    // and return the booking information for non owner
    if( spot && req.user.id !== spot.ownerId){
    const bookings = await spot.getBookings({
        attributes: ["userId","spotId", "startDate", "endDate"]
    })
    const bookingFormatDate = bookings.map(booking => {
        const bookingObj = booking.toJSON()

        const startDateFormat = dateFormated(bookingObj.startDate)
        const endDateFormat = dateFormated(bookingObj.endDate)
        console.log(startDateFormat)
        bookingObj.startDate = startDateFormat
       bookingObj.endDate = endDateFormat

        return bookingObj
    })
    
    res.json({Bookings:bookingFormatDate})

    }
     else if(spot && req.user.id === spot.ownerId) {
         const bookings = await spot.getBookings({
            include: {
                model: User,
                attributes:["id", "firstName", "lastName"]
            }
         });

         const bookingsFormatDate = bookings.map(booking => {
            const bookingObj = booking.toJSON();
            

            const startDateFormat = dateFormated(bookingObj.startDate)
            const endDateFormat = dateFormated(bookingObj.endDate)
            bookingObj.startDate = startDateFormat
           bookingObj.endDate = endDateFormat
           

            return {
                User: {
                    id:bookingObj.User.id,
                    firstName: bookingObj.User.firstName,
                    lastName: bookingObj.User.lastName,
                },
                id: bookingObj.id,
                spotId: bookingObj.spotId,
                startDate: bookingObj.startDate,
                endDate: bookingObj.endDate,
                createdAt: bookingObj.createdAt,
                updatedAt: bookingObj.updatedAt

            }


         })

         return res.json({Bookings:bookingsFormatDate})


    }
    else {
        res.status(404).json({message:"Spot couldn't be found"})
    }



});



router.post("/", requireAuth, bookingsValidation,async(req, res, next )=> {
    
    const spot = await Spot.findByPk(req.params.spotId)

    if(spot){
        if(spot.ownerId !== req.user.id) {
        const { startDate, endDate} =  req.body;
        const spotBookings = await spot.getBookings({
            attributes:["startDate", "endDate"]
        });
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
            


                const newBooking = await spot.createBooking({
                    userId: req.user.id,
                    startDate,
                    endDate
                })
                const bookingObj = newBooking.toJSON();

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
            res.status(403).json({message:"Forbidden"})
        }

    }

    else {
        return res.status(404).json({message:"Spot couldn't be found"})
    }


})



module.exports = router