import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const Add = () => {

    //how to take values from input, by takeing usestate
    const [tasks, setTasks]=useState({
        email:"",
        password:"",
    });

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setTasks(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    console.log(tasks)

    const handleClick = async e =>{
        e.preventDefault()
        try{
            await axios.post("http://localhost:8800/users",tasks)
            navigate("/tasks")
        }
        catch(err){
            console.log(err)
        }
    }
  return (
    <div>
        <div className="form">
        <h3>Add page</h3>
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

        <button onClick={handleClick}>Add</button>
    </div>
  )
}

export default Add
