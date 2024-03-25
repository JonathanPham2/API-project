import { useParams } from "react-router-dom"
import CreateSpot from "../CreateSpot"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { spotByIdFetcher } from "../../store/spot"





const UpdateSpot = () => {
    const {id} = useParams()
    const spotId = parseInt(id,10)
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()  => {
        const fetchData = async ()=> {
            try {
        await dispatch(spotByIdFetcher(spotId))
            }
        catch(error){
            const data = await error.json();
            if(data&& data.message){
                setErrors({message: error.message})
            }
        }finally {
            setIsLoading(false)

        }
        }
        fetchData()
        
    },[dispatch, spotId])
    const spot = useSelector(state => state.spots[spotId])
    if(isLoading) {
        return <div>Loading...</div>
    }
    if(errors.message){
        return <div>{errors.message}</div>
    }

    return (
        
    <CreateSpot spot={spot} isUpdateSpot={true} />
    )
    
}
export default UpdateSpot