import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios"

const Update = () => {
  //how to take values from input, by takeing usestate
  const [tasks, setTasks]=useState({
    email:"",
    password:"",
});

const navigate = useNavigate()
const location = useLocation()

const userId = location.pathname.split("/")[2]
console.log(location.pathname.split("/")[2])

const handleChange = (e) =>{
    setTasks(prev=>({...prev,[e.target.name]:e.target.value}))
}
console.log(tasks)

const handleClick = async e =>{
    e.preventDefault()
    try{
        await axios.put("http://localhost:8800/users/"+userId,tasks)
        navigate("/tasks")
    }
    catch(err){
        console.log(err)
    }
}
return (
<div>
    <div className="form">
    <h3>Update page</h3>
    <input 
    type="text" 
    placeholder="email" 
    onChange={handleChange} 
    name="email"
    />
    <input 
    type="password" 
    placeholder="password"
    onChange={handleChange}  
    name="password"/>
    </div>

    <button onClick={handleClick}>Update</button>
</div>
)
}

export default Update
