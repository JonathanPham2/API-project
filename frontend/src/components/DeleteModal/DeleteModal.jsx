import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import './DeleteModal.css'
import { deleteSpot } from "../../store/spot"
import { deleteReview } from "../../store/reviews"


const DeleteModal = ({spotId,reviewId , onSpotsChanged, isDeleteReview, onReviewDeleted}) => {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleDeleteReview = async () => [
        await dispatch(deleteReview(reviewId))
        .then(() => {
            closeModal()
            if(onReviewDeleted) {
                onReviewDeleted()
            }
        })


    ]


    const  handleDelete = async () => {
       await  dispatch(deleteSpot(spotId))
        .then(() => {
            closeModal()
            if(onSpotsChanged) {
                onSpotsChanged()
            }
        })
    
    }
    return (
    <div className="confirm-container"> 
    <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings</p>
        <div className="delete-button-container">
        <button onClick={isDeleteReview? handleDeleteReview:handleDelete}>{isDeleteReview?`Yes (Delete Reviews)` :`Yes (Delete Spot)`}</button>
        < button onClick={closeModal}> {isDeleteReview?`No (Keep Review)` :`No (Keep Spot)`}</button>
        </div>
    
    </div>

    )
}

export default DeleteModal