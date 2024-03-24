import { csrfFetch } from "./csrf.js"; 
import { createSelector } from 'reselect'

//Action Type Constants
const LOAD_SPOTS = "spots/loadAllSpots"

const LOAD_SPOT_BY_ID = "spots/:id"

const ADD_SPOT = "spots/addSpot"

// Action Creators
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

const loadSpotById = (id, spot) => ({
    type: LOAD_SPOT_BY_ID,
    payload:{id, spot}
})

const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot
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
// add new spot 
export const addNewSpot = (payload) => async (dispatch)=> {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload.modifiedFormSpot)
        
    })
    const data =  await response.json()
    console.log("data from server",data)
        await dispatch(addSpot(data))
        for(const image of payload.spotImages) {
            await csrfFetch(`/api/spots/${data.id}/images`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url:image.url,
                    preview:image.preview
                
                })
                
            })
        }
        return data

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
        case ADD_SPOT: {
            return {...state, lastAddedSpot: action.spot.id}
        }
        default:
            return state
    }
}

export default spotsReducer