import './Tooltip.css'
const Tooltip = (props) => {
    const { spot, children} = props
    return (
    <div className="tooltip">
        {children}
        <span className="spot-name-tooltip">{spot.name}</span>
    </div>
    )
    
}

export default Tooltip