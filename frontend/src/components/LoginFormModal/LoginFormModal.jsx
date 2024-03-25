import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  // check the length of credential and password if it less than certain amount the log in button will be disabled
  const buttonDisable = credential.length >= 4 && password.length >=6;
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .then(navigate("/"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  // handle demo login
  const handleDemoLogin = () => {
   const demoUsername= "Demo1"
   const demoPassword = "password2"
    return dispatch(sessionActions.login({credential:demoUsername, password:demoPassword}))
   .then(closeModal)
   .then(navigate("/"))
  }

  return (
    <>
      <h1>Log In</h1>
      <form className='login-form-main' onSubmit={handleSubmit}>
        <label className='login-form'>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='login-form'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" disabled={!buttonDisable}>Log In</button>
        <button type="button" onClick={handleDemoLogin}>Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
