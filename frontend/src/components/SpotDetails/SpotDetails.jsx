import { useDispatch, useSelector} from "react-redux"
import { useParams } from "react-router-dom"
import { spotByIdFetcher } from "../../store/spot"
import { useEffect, useState } from "react"
import './SpotDetails.css'
import { reviewsBySpotIdFetcher, selectorReviewsArray } from "../../store/reviews"



const SpotDetails = () => {
    // state error for invalid id
    const [errors, setErrors] = useState({})
    const [reviewsErrors, setReviewsErrors] = useState({})
    // id of the spot
    const {id} = useParams()
    // convert id from string integer
    const spotId = parseInt(id,10)
    const dispatch = useDispatch()
    
    
    useEffect(() => {
        dispatch(spotByIdFetcher(spotId))
        .catch(async (res) => {
            const data = await res.json();
            if(data&& data.message){
                setErrors(data)
            }
        });
        dispatch(reviewsBySpotIdFetcher(spotId))
        .catch(async (res) => {
            const data = await res.json()
            if(data){
                setReviewsErrors(data)
            }
        })
     
        
    },[dispatch,spotId])
    const spot = useSelector(state => state.spots[spotId])
    const reviews = useSelector(selectorReviewsArray)
    const owner = spot?.Owner
    const images = spot?.SpotImages

    return (
        <main>
            <section className="spot-details-header">
                <h1 id="spot-header">{spot?.name}</h1>
                <h3>{spot?.city}, {spot?.state}, {spot?.country}</h3>
                <div className="images-container">
                    {images?.map((image, index) => (<img key={image.id} src={image.url} alt={spot?.name} className={index >= 5 ? "hidden-image": (index === 0 ? "main-image":`small-image ${index}`)}/>))}


                    {errors.message && <h1>{errors.message}</h1> }
                    {reviewsErrors.message && <h1>{reviewsErrors.message}</h1>}
                </div>
            </section>
            <section className="spot-details-body">
                <h2>Hosted by {owner?.firstName} {owner?.lastName}</h2>
                <div>
                    <p>{spot?.description}</p>
                    <div className="price-reviews-stars">
                        <p id="spot-price"><strong>${spot?.price}</strong> night</p>
                        <p id="spot-rating"><i className="fa fa-star"></i>{spot?.avgRating}</p>
                        <p id="spot-review-count">{spot?.numReviews} reviews</p>
                        <button  onClick={() => alert("feature coming soon")}>Reserve</button>
                    </div>
                </div>
            </section>
            <section className="reviews-comments">
                <div className="reviews-header">
                    <h2><span><i className="fa fa-star"></i>{spot?.avgRating}</span></h2>
                    <h2><span>{spot?.numReviews} reviews</span></h2>
                </div>
                <div className="comments-section">
                    {reviews?.map((review) => (
                        <div className="user-comment" key={review.id}>
                            <h3>{review?.User.firstName}</h3>
                            <span style={{fontWeight:"100"}}>
                                {(()=> {
                                    // convert date into human readable
                                    const reviewDate = new Date(review.createdAt)
                                    console.log(reviewDate)
                                    const options = { year: "numeric", month: "long" };
                                    return new Intl.DateTimeFormat("en-US", options).format(reviewDate)
                                })()}
                            </span>
                            <p>{review.review}</p>
                            
                            
                            
                            
                         </div>
                        
                        
                        
                    ))}


                </div>
            </section>
        </main>
    )


}



export default SpotDetails