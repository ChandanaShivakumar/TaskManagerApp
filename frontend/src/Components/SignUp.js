import React, { useState } from 'react';
import '../Style/signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    // Use useState to manage form values
    const [users, setUsers] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confpa: "",
    });

    const navigate = useNavigate();

    // Validate form inputs
    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';

        const { firstname, lastname, email, password, confpa } = users;

        if (firstname === null || firstname === '') {
            isproceed = false;
            errormessage += ' First Name';
        }
        if (lastname === null || lastname === '') {
            isproceed = false;
            errormessage += ' Last Name';
        }
        if (email === null || email === '') {
            isproceed = false;
            errormessage += ' Email';
        }
        if (password === null || password === '') {
            isproceed = false;
            errormessage += ' Password';
        }
        if (confpa === null || confpa === '') {
            isproceed = false;
            errormessage += ' Confirm Password';
        }

        if (!isproceed) {
            toast.error(errormessage);
        } else {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                // valid email
            } else {
                isproceed = false;
                toast('Please enter a valid email');
            }
            if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
                // valid password
            } else {
                isproceed = false;
                toast('Password should have - Minimum 8 characters (at least 1 letter, 1 number and 1 special character)');
            }

            if (confpa === password) {
                // passwords match
            } else {
                isproceed = false;
                toast('Password does not match');
            }
        }
        return isproceed;
    }

    const handleChange = (e) => {
        setUsers(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (IsValidate()) {
            try {
                await axios.post("https://task-manager-app-three-orcin.vercel.app/user", users);
                toast.success('Signup successful');
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } catch (err) {
                toast.error('Failed: ' + err.message);
            }
        }
    }

    return (
        <div>
            <div className='signup-container'>
                <h3><b>Signup</b></h3>
            </div>
            <div className="scontainer d-flex justify-content-center align-items-center">
                <div className="signup-box">
                    <form>
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="fname" 
                                placeholder="First Name"
                                onChange={handleChange} 
                                name="firstname"
                            />
                        </div>
                        <ToastContainer />
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="lname" 
                                placeholder="Last Name"
                                onChange={handleChange} 
                                name="lastname"
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Email"
                                onChange={handleChange} 
                                name="email"
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Password"
                                onChange={handleChange} 
                                name="password"
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control" 
                                id="cnfpassword" 
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                name="confpa"
                            />
                        </div>
                        <div className="mb-3">
                            <button 
                                type="submit" 
                                className="btn btn-primary" style={{ width: "100%" }} onClick={handleClick}>
                                Signup
                            </button>
                        </div>
                    </form>
                    <div style={{textAlign:"center"}}>
                        <p>Already have an account? &nbsp;<Link to="/login" className="signup-link"><b>Login</b></Link></p>

                    <button className="btn btn-primary">
                        Signup with <b>Google</b>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
