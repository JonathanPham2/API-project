
import './Spots.css'
import Tooltip from '../Tooltip'
import { useNavigate } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import DeleteModal from '../DeleteModal'




const SpotList = ({spots, isManageView,onSpotsChanged}) => {
    const navigate = useNavigate()


    const handleUpdate = (spotId) => {
        navigate(`/spots/${spotId}/edit`)
    }
    return (
        <div className="spots-container">
        {spots.map((spot)=> (
        <Tooltip key = {spot.id} spot = {spot}>
         <div key ={spot.id} className="spot-card" onClick={() => {
            navigate(`/spots/${spot.id}`)
         }} >
            <img className='spot-image' src={spot.previewImage} alt={spot.name} />
            <div className="spot-details">
                <p>{spot.city}, {spot.state} </p>
                <p> <i className="fas fa-star"></i>{spot?.avgRating === "Rate me" ? "No Ratings Yet" :`${Number(spot.avgRating).toFixed(1)}`}</p>
            </div>
            <p><span style={{fontWeight:"bold"}}>${spot.price}</span>night</p>
         </div>
         {isManageView && (
                 <div className='manage-buttons'>
                      <button onClick={() => handleUpdate(spot.id)}>Update</button>
                      <OpenModalButton 
                      buttonText="Delete"
                      modalComponent={ <DeleteModal spotId = {spot.id} onSpotsChanged={onSpotsChanged}/>}
                

                      


                      
                      />

                    
                 </div>
            )}
         </Tooltip>
            
            

        ))}
        </div>

    )
}

export default SpotList