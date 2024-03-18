import { useDispatch, useSelector } from "react-redux"
import { selectorSpotsArray, spotFetcher } from "../../store/spot"
import { useEffect } from "react";
import SpotList from "../Spots";
import './LandingPage.css'



const LandingPage = () => {
    const dispatch = useDispatch()
    
    //getting the spots for redux store
    const spots = useSelector(selectorSpotsArray);
    
    // fetch the spot on inital render
    useEffect(() => {
        dispatch(spotFetcher())
    },[dispatch])

    return (
        <section className="spots">
        <SpotList  spots={spots} />
        </section>
    )

}


export default LandingPage