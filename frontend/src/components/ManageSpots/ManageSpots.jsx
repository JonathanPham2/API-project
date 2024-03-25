
import { useDispatch, useSelector } from "react-redux"
import './ManageSpots.css'
import { useEffect, useState } from "react"
import { selectorSpotsArray, spotFetcher } from "../../store/spot"
import SpotList from "../Spots"
import { useNavigate } from "react-router-dom"




const ManageSpots = () => {
    const session =  useSelector(state => state.session)
    const currentUser = session.user
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [spotsUpdated, setSpotsUpdated] = useState(false);

    
    const handleCreateSpot = () => {
        navigate("/spots/new")
    }
    
    //getting the spots for redux store
    const spots = useSelector(selectorSpotsArray).filter(spot => spot.ownerId === currentUser.id);

    
    // fetch the spot on inital render
    useEffect(() => {
        dispatch(spotFetcher())
        .then(() => {
            if (spotsUpdated) setSpotsUpdated(false)
        })
    },[dispatch, spotsUpdated])
    return (
        <main className="manage-spot-main">
            <h1 style={{textAlign: "left", marginLeft: "270px"}}>Manage Your Spots</h1>
            <button className="create-spot-button" onClick={handleCreateSpot}>Create New Spot</button>
            <section id="manage-spots-section">
            <SpotList  spots ={spots} isManageView={true} onSpotsChanged={() => setSpotsUpdated(true)}/>s
            </section>
        </main>
    )
}

export default ManageSpots 