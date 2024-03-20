import { csrfFetch } from "./csrf.js"; 
import { createSelector } from 'reselect'

//Action Type Constants
const LOAD_SPOTS = "spots/loadAllSpots"

const LOAD_SPOT_BY_ID = "spots/:id"

// Action Creators
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

const loadSpotById = (id, spot) => ({
    type: LOAD_SPOT_BY_ID,
    payload:{id, spot}
})

// Thunk Action Creators
// fetch all spots from api spot
export const spotFetcher = () => async(dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    dispatch(loadSpots(data.Spots))
    return response
}
//fetch specific spot by id 

export const spotByIdFetcher = (payload) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${payload}`)
    const data = await response.json()
    dispatch(loadSpotById(data.id, data))
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
        case LOAD_SPOT_BY_ID: {
            const {id, spot} =  action.payload

            return {...state,[id]: spot }
        }
        default:
            return state
    }
}

export default spotsReducer