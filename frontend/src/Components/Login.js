import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import '../Style/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('https://task-manager-app-three-orcin.vercel.app/login', {
        params: {
          email: email,
          password: password
        }
      });

      if (response.data.success) {
        toast.success('Login successful!');
        login({
          id: response.data.userId,
          firstname: response.data.firstname,
          email: email
        });
        
        //console.log("login successful firstname is ", response.data.firstname)
        navigate(`/user/${response.data.userId}/task`);
        
      } else {
        toast.error('Login not successful. Invalid credentials.');
      }
    } catch (err) {
      toast.error('Login not successful. Invalid credentials.');
    }
  };

  return (
    <div>
      <div className='login-container'>
        <h3><b>Login</b></h3>
      </div>

      <div className="container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="email" 
                className="form-control" 
                name="email" 
                placeholder="Email"
                onChange={handleChange} 
              />
            </div>

            <div className="mb-3">
              <input 
                type="password" 
                className="form-control" 
                placeholder="Password"
                onChange={handleChange}
                name="password"
              />
            </div>
            <div className="mb-3">
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: "100%" }} 
              >
                Login
              </button>
            </div>
          </form>
          <ToastContainer />
          <div style={{textAlign:"center"}}>
            <p>Don't have an account?
            &nbsp;<Link to="/signup" className="signup-link"><b>Signup</b></Link></p>

          <button className="btn btn-primary">
            Login with <b>Google</b>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
