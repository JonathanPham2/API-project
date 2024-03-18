
import './Spots.css'



const SpotList = ({spots}) => {
    return (
        <div className="spots-container">
        {spots.map((spot)=> (
         <div key ={spot.id} className="spot-card" >
            <img className='spot-image' src={spot.previewImage} alt={spot.name} />
            <div className="spot-details">
                <p>{spot.city}, {spot.state} </p>
                <p> <i className="fas fa-star"></i>{spot.avgRating}</p>
            </div>
            <p><span style={{fontWeight:"bold"}}>${spot.price}</span>night</p>
         </div>
            
            

        ))}
        </div>

    )
}

export default SpotList