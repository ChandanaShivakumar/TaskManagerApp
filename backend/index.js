//main js file

import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from 'bcrypt';

const app = express()


const db = mysql.createConnection({
    host: "brr5735eneygtnzah18a-mysql.services.clever-cloud.com",
    user: "unda3lbwbyydfbeq",
    password: "r0i8lC6NX6ToaE0GTfS7",
    database: "brr5735eneygtnzah18a",
    port:3306
})


//making an api request using express server
app.get("/",(req,res)=>{
    res.json("hello this is the backend")
})


//if there is an auth problem with below command, use
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root@123';
//exit myhsql client
//edit little vscode
//save and run
//itll work..it worked for me!


//allows you to send any json file using a client
app.use(express.json())

//cors
// app.use(cors())
const allowedOrigins = ['https://task-manager-app-frontend-ashen.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


app.get("/users", (req,res)=>{
    const q="select * from users";

    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})


// GetUser
app.get("/user", (req,res)=>{
    const q="select * from user";

    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})


//GetLoginUser
app.get("/login", (req, res) => {
    const { email, password } = req.query;

    // console.log('Received email:', email);
    // console.log('Received password:', password);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const q = "SELECT * FROM user WHERE email = ?";
    
    db.query(q, [email], async (err, data) => {
        if (err) {
            // console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        // console.log('Database query result:', data);

        if (data.length > 0) {
            const user = data[0];
            // console.log('User data:', user);

            try {
                const match = await bcrypt.compare(password, user.password);
                // console.log('Password match result:', match);

                if (match) {
                    // console.log("User ID is", user.userid);
                    return res.json({ success: true, userId: user.userid, firstname: user.firstname});
                } else {
                    return res.status(401).json({ success: false, error: 'Invalid credentials' });
                }
            } catch (compareError) {
                // console.error('Password comparison error:', compareError.message);
                return res.status(500).json({ error: compareError.message });
            }
        } else {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    });
});


//PostUser without hashing

// app.post("/user", (req,res)=>{
//     const q="insert into user (firstname, lastname, email, password) values (?)";
//     //const values = ['xyz1@gmail.com','xyz1@123'];
//     const values =[
//         req.body.firstname,
//         req.body.lastname,
//         req.body.email,
//         req.body.password
//     ];

//     db.query(q,[values], (err,data)=>{
//         if(err) return res.json(err)
//             return res.json("Signup Successful!")
//     })
// })


//PostUser with hashing
const saltRounds = 10;
app.post("/user", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const q = "insert into user (firstname, lastname, email, password) values (?)";
    const values = [firstname, lastname, email, hashedPassword];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Signup Successful!");
    });
});


//PostLoginUser
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // console.log('Received email:', email);
    // console.log('Received password:', password);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const q = "SELECT * FROM user WHERE email = ?";
    
    db.query(q, [email], async (err, data) => {
        if (err) {
            //console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        //console.log('Database query result:', data);

        if (data.length > 0) {
            const user = data[0];
            console.log('User data:', user);

            try {
                const match = await bcrypt.compare(password, user.password);
                // console.log('Password match result:', match);

                if (match) {
                    //console.log("User name is", user.firstname);
                    return res.json({ success: true, userId: user.id, firstname: user.firstname });
                } else {
                    return res.status(401).json({ success: false, error: 'Invalid credentials' });
                }
            } catch (compareError) {
                // console.error('Password comparison error:', compareError.message);
                return res.status(500).json({ error: compareError.message });
            }
        } else {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    });
});


//GetTask
app.get("/task", (req,res)=>{
    const q="select * from task";

    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})


//GetTask with UserID
app.get('/task/:userid', (req, res) => {
    const userId = req.params.userid;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    const q = 'SELECT * FROM task WHERE userid = ?';
  
    db.query(q, [userId], (err, data) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(data);
    });
  });
  


//PostTask
app.post("/task", (req, res) => {
    const q = "INSERT INTO task (taskname, taskdescription, taskcreateddate, taskcolumn, userid) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.taskname,
      req.body.taskdescription,
      req.body.taskcreateddate,
      req.body.taskcolumn,
      req.body.userid
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: "Task added successfully", taskId: data.insertId });
    });
  });
  


//DeleteTask
app.delete("/task/:taskid",(req,res)=>{
    const taskId = req.params.taskid;
    const q = "delete from task where taskid = ?";

    db.query(q,[taskId],(err,data)=>{
        if(err) return res.json(err)
            return res.json("task deleted successfully")
    })
})


//UpdateTask
app.put("/task/:taskid", (req, res) => {
    const taskId = req.params.taskid;
    const { taskname, taskdescription, taskcolumn } = req.body;
  
    const q = "UPDATE task SET taskname = ?, taskdescription = ?, taskcolumn = ? WHERE taskid = ?";
    const values = [taskname, taskdescription, taskcolumn, taskId];
  
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json({
        taskid: taskId,
        taskname,
        taskdescription,
        taskcolumn
      });
    });
  });
  
  


app.delete("/users/:id",(req,res)=>{
    const userId = req.params.id;
    const q = "delete from users where id = ?";

    db.query(q,[userId],(err,data)=>{
        if(err) return res.json(err)
            return res.json("user deleted successfully")
    })
})

app.put("/users/:id",(req,res)=>{
    const userId = req.params.id;
    const q = "update users set `email` = ?, `password`=? where id = ?";

    const values =[
        req.body.email,
        req.body.password
    ];

    db.query(q,[...values,userId],(err,data)=>{
        if(err) return res.json(err)
            return res.json("user updated successfully")
    })
})

//using postman to test the post method and the endpoints coz broswer alli only get method can be tested.

app.listen(8800, ()=>{
    console.log("Connected to backend!")
})
