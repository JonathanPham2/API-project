import { useState } from 'react'
import './ReviewModal.css'
import { useDispatch } from 'react-redux'
import { FaStar } from 'react-icons/fa'




const ReviewModal = () => {
    const [review, setReview] = useState("")
    const [ starRating, setStarRating] = useState(0)

    const handleChange = (e) => {
        setReview(e.target.value)

        
    } 

    const handleSubmit = (e) => {
        e.preventDefault ()
    
    }
    return (
        <div className='review-form-container' >
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit} className='review-form'>
                <textarea name='review' id='review-box' placeholder='Leave your review here'
                value={review}
                onChange={handleChange}
                ></textarea>
            
                <button type='submit'>Submit Your Review</button>
                
            </form>
        </div>
    )
}

export default ReviewModal