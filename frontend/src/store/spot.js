import { csrfFetch } from "./csrf.js"; 
import { createSelector } from 'reselect'

//Action Type Constants
const LOAD_SPOTS = "spots/loadAllSpots"

// Action Creators
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

// Thunk Action Creators
// fetch spot from api spot
export const spotFetcher = () => async(dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    console.log("data",data)
    dispatch(loadSpots(data.Spots))
    return response
}

//Spot Selector:

const selectorSpots = (state) => state.spots
export const selectorSpotsArray = createSelector(selectorSpots,(spots)=> Object.values(spots))

const initialState = {};


const spotsReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            const spotState = {};
            action.spots.forEach((spot) => {
                spotState[spot.id] = spot
            });
            return spotState
        }
        default:
            return state
    }
}

export default spotsReducer