import { useState } from 'react'
import './ReviewModal.css'
import { useDispatch } from 'react-redux'
import { FaStar } from 'react-icons/fa'
import { createReview, reviewsBySpotIdFetcher } from '../../store/reviews'
import { useModal } from '../../context/Modal'






const ReviewModal = ({id}) => {
    const [review, setReview] = useState("")
    const [ starRating, setStarRating] = useState(0)
    const [starHover, setStarHover] = useState(0)
    const [validateErrors, setValidateErrors] = useState(null)
    const buttonDisabled =  review.length > 10 && starRating >= 1
    const dispatch = useDispatch()
    const {closeModal} = useModal()



    //function that will handle stars rating 
    const starsRender = () => {
        let stars = [];
        for(let i = 1; i <= 5; i++){
        stars.push(
            <FaStar
            key={i} 
            className={i <= ( starHover || starRating) ? "filled-star" : "empty-star"}
            onMouseEnter={() => setStarHover(i)}
            onMouseLeave={() => setStarHover(0)}
            onClick={() => {
                // this conditon to check if the user click on the star again after it filled will unfill it 
                if(starRating === i ){
                    setStarRating(i-1)
        
                }
                else {
                    setStarRating(i)
                }
            }}

            />
        )   

        }
        return stars
    }


    // function that will handle the changes in values
    const handleChange = (e) => {
        setReview(e.target.value)

        
    } 

    // function that will handle submit
    const handleSubmit = async (e) => {
        e.preventDefault ()
        const payload = {
            review,
            stars: starRating
        }
       await  dispatch(createReview(payload,id))
             .then(closeModal)
                .catch(async (res)=> {
                    const data = await res.json()
                    if(data) {
                        setValidateErrors(data)
                    }
                })
            dispatch(reviewsBySpotIdFetcher(id))
        

    
    }
    return (
        <div className='review-form-container' >
            <h1>How was your stay?</h1>
             {validateErrors&&<span style={{color: "red", marginBottom: "20px"}}> {validateErrors?.message}</span>}
            <form onSubmit={handleSubmit} className='review-form'>
                <textarea name='review' id='review-box' placeholder='Leave your review here'
                value={review}
                onChange={handleChange}
                ></textarea>
                <div className='stars-container' >{starsRender()} Stars</div>
                <button disabled={!buttonDisabled} type='submit'>Submit Your Review</button>
                
            </form>
        </div>
    )
}

export default ReviewModal