import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';


const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(()=>{
    const fetchTasks = async () => {
      try{
        const res = await axios.get("http://localhost:8800/users")
        setTasks(res.data)
        //console.log(res)
      }
      catch(err){
        console.log(err)
      }
  }
  fetchTasks()
},[])

const handleDelete = async (id)=>{
  try{
    await axios.delete("http://localhost:8800/users/"+id)
    //await axios.delete(`http://localhost:8800/users/${id}`)
    window.location.reload()
  }
  catch(err){
    console.log(err);
  }
}

  return (
    <div>
      <h5>Tasks page - but displaying users for now!</h5>
      <div className="tasks">
        {tasks.map(users=>(
          <div className="tasks" key={users.id}>
            <h3>{users.email}</h3>
            <button className="delete" onClick={()=>handleDelete(users.id)}>Delete</button>
            <button className="update"><Link to={`/update/${users.id}`}>Update</Link></button>
            </div>
        ))}
      </div>
      <br></br>
      <button>
        <Link to="/add">Add new task</Link>
      </button>
    </div>
  )
}

export default Tasks
