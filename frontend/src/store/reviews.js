import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

//Action Type Constants
const LOAD_REVIEW_BY_SPOT_ID = "spots/:id/reviews"


//Action Creators
const loadReviewBySpotId = (reviews) => ({
    type: LOAD_REVIEW_BY_SPOT_ID,
    reviews

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
        default:
            return state
    }
}
export default reviewsReducer