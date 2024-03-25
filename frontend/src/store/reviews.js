
import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

//Action Type Constants
const LOAD_REVIEW_BY_SPOT_ID = "spots/:id/reviews"
const ADD_REVIEW_BY_SPOT_ID = "add/spots/review"
const DELETE_REVIEW = "delete/reviews"

//Action Creators
const loadReviewBySpotId = (reviews) => ({
    type: LOAD_REVIEW_BY_SPOT_ID,
    reviews

})

const addReview = (review) => ({
    type: ADD_REVIEW_BY_SPOT_ID,
    review
})
const deleteReviewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})
// Thunk Action Creators
//fecth all reviews of specific spot id
export const reviewsBySpotIdFetcher = (id) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`)
    const data = await response.json()
    const reviews = data.Review
    dispatch(loadReviewBySpotId(reviews))
    return response
}
// create the review
export const createReview = (payload, id) => async(dispatch) => {
        const response = await csrfFetch(`/api/spots/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify(payload)
        })
        const data = await response.json();
        
        dispatch(addReview(data))
        return response
    
    }

    export const deleteReview = (reviewId)=> async(dispatch) => {
        const response = await csrfFetch(`/api/reviews/${reviewId}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
                
            },

        })
        const data = await response.json()
        dispatch(deleteReviewAction(data))
        return response
    }

// Review selector
const selectorReviews = (state) => state.reviews
// Review array
export const selectorReviewsArray = createSelector(selectorReviews, (reviews) => Object.values(reviews))

const initialState = {}
// Reviews Reducers
const reviewsReducer = (state =initialState, action) => {
    switch(action.type){
        case LOAD_REVIEW_BY_SPOT_ID: {
            const reviewState = {}
        
        
            action.reviews.forEach((review) => {
                reviewState[review.id] = review
            })
            return reviewState

    
        }
        case ADD_REVIEW_BY_SPOT_ID: {
            return {...state, [action.review.id]: action.review}
        }
        case DELETE_REVIEW: {
            return {...state}
        }
        default:
            return state
    }
}
export default reviewsReducer