import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import houseImage from '../../../dist/house.jpg'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navigation-bar'>
      <li>
        <NavLink to="/"><img src={houseImage} alt="" className='nav-house-icon' /></NavLink>
      </li>
      <li className={sessionUser? "create-spot" : "hidden-create-spot"}>
        <NavLink className="create-new-spot" to="/spots/new"> Create New Spot</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
          
        </li>
        
      )}
    </ul>
  );
}

export default Navigation;
