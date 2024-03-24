import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import './CreateSpot.css'
import { addNewSpot } from "../../store/spot"
import { useNavigate } from "react-router-dom"

const CreateSpot = () => {
   const id = useSelector(state => state.spots.lastAddedSpot)
   const navigate = useNavigate()

    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted]  = useState(false)
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        lat: "",
        lng: "",
        name: "",
        description: "",
        price: "",
        imageLinkPreview: "",
        imageLink: {
            imageLink1: "",
            imageLink2:"",
            imageLink3: "",
            imageLink4: ""
        }

    })
    const {imageLink} = formData
    // function that change the input value state when ever the user type in
    const handleChange = (e) => {
        // take in event as parameter 
        // then extract the name and the value of that event target
        const { name, value  } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

    }
    //this function is for handle image change 
    const handleImageChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            imageLink:{
                ...imageLink,
                [name]: value
            }
        })
        
    }
    //function that handle submit

    // take in event as parameter
    const handleSubmit = async (e) => {
            e.preventDefault()
            //checking the errors length if it is = 0 we process the submit
            if(Object.keys(errors).length === 0) {
                const modifiedFormSpot = {...formData}
                delete modifiedFormSpot.imageLinkPreview;
                delete modifiedFormSpot.imageLink
            
            // destruct all other images
            const {imageLink} =  formData
            // get the value (url) from the images
            const images = Object.values(imageLink)
            const spotImages = []
            spotImages.push({url:formData.imageLinkPreview, preview: true})
            // checking if there is url in the images array before processing
            if(images.length){
                spotImages.push(...images.map(image => ({url: image, preview: false})))
            }
            // initailize payload object that contain spot and spot images
            const payload ={
                modifiedFormSpot,
                spotImages
            }

            // wait for all the action complete then navigate to that new spot
            try {
             await  dispatch(addNewSpot(payload))
             setIsSubmitted(true)
        
            }
            catch(error) {
                console.error("failed to create the spot", error)
            }

        }
    }
    useEffect(() => {
        if(id && isSubmitted) {
    
            navigate(`/spots/${id}`)
            setIsSubmitted(false)
            }

         
    },[id, navigate, isSubmitted])
    const handleClick = () => {
        const newErrors = {}
        const {imageLink} = formData
        Object.keys(formData).forEach(key => {
            
            if(key === "description"){
                if(formData[key].length < 30) {
                    newErrors[key] =`${key[0].toUpperCase().concat(key.slice(1))} needs a minimum of 30 characters`
                }
            }
            if(formData[key] === "" && key !== "description"){
                newErrors[key] = `${key[0].toUpperCase().concat(key.slice(1))} is required`   
            }
            if(key ==="imageLinkPreview" && formData[key] !== "" ){
                if(!(formData[key].endsWith(".png") || formData[key].endsWith(".jpg") || formData[key].endsWith(".jpeg")))
                newErrors[key] = `Image URL must end in .png, .jpg, .jpeg`

            }
            else if (key === "imageLinkPreview" && formData[key] === "") {
                newErrors[key] = "Preview Image is required";
            }
            
        })

        Object.keys(imageLink).forEach(key => {
            if(imageLink[key] !== ""){
                if(!(imageLink[key].endsWith(".png") || imageLink[key].endsWith(".jpg") || imageLink[key].endsWith(".jpeg"))){
                    newErrors[key] =`Image URL must end in .png, .jpg, .jpeg`
                }
            }
        })
        setErrors(newErrors)


    }
    

    return (
        <main className="form-container">
            <section className='form-header'>
            <h1>Create a new Spot</h1>
            <h1>Where&apos;s your place located</h1>
            <p>Guests will only get your exact address once they booked a reservation</p>
            </section>
            <form onSubmit={handleSubmit}  className='spot-create-form'>
                <section className='form-details-location'>
                    <label htmlFor="country">Country {errors.country&&<span style={{color: "red", marginLeft: "7px"}}>{errors.country}</span>}</label>
                    <input onChange={handleChange}  type="text" name="country" id="country" value={formData.country} required />
                    <label htmlFor="street-address">Street Address {errors.address?<span style={{color: "red", marginLeft: "10px"}}>{errors.address}</span>:null}</label>
                    <input  value={formData.address} onChange={handleChange} type="text" name='address' id='street-address'required />
                    <div className='city-state'>
                        <div className='city'>
                            <label htmlFor="city">City {errors.city?<span style={{color: "red", marginLeft: "7px"}}>{errors.city}</span>:null}</label>
                            <input type="text" name='city' id='city' value={formData.city} onChange={handleChange} required />
                        </div><p className='commas'>,</p>
                        <div className='state'>
                            <label htmlFor="state">State {errors.state?<span style={{color: "red", marginLeft: "7px"}}>{errors.state}</span>:null}</label>
                            <input type="text" name='state' id='state' value={formData.state} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='latitude-and-long'>
                        <div className='latitude'>
                            <label htmlFor="latitude">Latitude {errors.lat?<span style={{color: "red", marginLeft: "7px"}}>Latitude is required</span>:null}</label>
                            <input type="number" name='lat' id='latitude' value={formData.lat}  onChange={handleChange}required />
                        </div><p className='commas'>,</p>
                        <div className='longitude'>
                            <label htmlFor="longitude">Longitude {errors.lng?<span style={{color: "red", marginLeft: "5px"}}>Longitude is required</span>:null}</label>
                            <input type="number" name='lng' id='longitude'min="-180" max="180" value={formData.lng} onChange={handleChange} required/>
                        </div>
                    </div>
                </section>
                <hr />
                <section className='description'>
                    <label className="description-label" htmlFor="description-box">Describe your place to guests</label>
                    <p className='description-hint'>
                        Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                   <textarea name="description" id="description-box" placeholder='Please write at least 30 characters' required value={formData.description} onChange={handleChange} ></textarea>
                   {errors.description?<span style={{color: "red", marginLeft: "1px"}}>{errors.description}</span>:null}
                </section>
                <hr />
                <section className='spot-title'>
                    <label className='spot-title-label' htmlFor="spot-title">Create a title for your spot</label>
                    <p style={{fontSize: "14px"}}>Catch guest&#39;s attention with a spot title that highlights what makes your place special</p>
                    <input type="text" id='spot-title' name='name' placeholder='Name of your spot'value={formData.name} onChange={handleChange} required />
                    {errors.name?<span style={{color: "red", marginLeft: "1px"}}>{errors.name}</span>:null}
                </section>
                <hr />
                <section className='spot-price-form'>
                    <label style={{fontSize: "25px"}}  htmlFor="spot-price-form">Set a base price for your spot</label>
                    <p style={{fontSize: "14px"}}>Competitive pricing can help your listing stand out and rank higher in search result</p>
                    <div style={{display: "flex", gap: "10px"}}>
                        <span style={{marginTop: "4px"}}>$</span>
                        <input type="text" id='spot-price-form' name='price' onChange={handleChange} value={formData.price} placeholder='Price per night(USD)' required/>
                    </div>
                    {errors.price?<span style={{color: "red", marginLeft: "1px"}}>{errors.price}</span>:null}

                </section>
                <hr />
                <section className='spot-images-form'>
                    <label style={{fontSize: "25px"}}  htmlFor="spot-images-form">Liven up your spot with photos</label>
                    <p style={{fontSize: "14px"}}>Submit a link to at least one photo to publish your spot</p>
                    <input type="url" id='image-preview' name='imageLinkPreview' placeholder='Preview Image URL'onChange={handleChange} value={formData.imageLinkPreview} required />
                    {errors.imageLinkPreview?<span style={{color: "red",  marginTop: "200px"}}>{errors.imageLinkPreview}</span>:null}
                    
                    <input type="url" id='image-1' name='imageLink1' placeholder='Image URL' onChange={handleImageChange} value={imageLink.imageLink1}/>
                    {errors.imageLink1?<span style={{color: "red",  marginTop: "200px"}}>{errors.imageLink1}</span>:null}
                    <input type="url" id='image-2' name='imageLink2' placeholder='Image URL' onChange={handleImageChange} value={imageLink.imageLink2} />
                    {errors.imageLink2?<span style={{color: "red",  marginTop: "200px"}}>{errors.imageLink2}</span>:null}
                    <input type="url" id='image-3' name='imageLink3' placeholder='Image URL' onChange={handleImageChange} value={imageLink.imageLink3}  />
                    {errors.imageLink3?<span style={{color: "red",  marginTop: "200px"}}>{errors.imageLink3}</span>:null}
                    <input type="url" id='image-4' name='imageLink4' placeholder='Image URL' onChange={handleImageChange} value={imageLink.imageLink4} />
                    {errors.imageLink4?<span style={{color: "red",  marginTop: "200px"}}>{errors.imageLink4}</span>:null}
                </section>
                <hr />
                <div className='button-spot-container'>
                    <button onClick={handleClick} type='submit'>Create Spot</button>
                </div>
            </form>
           
            
        </main>
    )

}

export default CreateSpot