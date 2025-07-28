const express=require("express");
const ConnectToDb = require("./config/connectToDb");
const app=express();
require("dotenv").config();
const port=process.env.PORT;
const userRouter=require("./routes/authRouter");
const tasksRouter=require("./routes/taskRouter");
app.use(express.json());
ConnectToDb()
app.use(userRouter);
app.use(tasksRouter);







app.listen(port,()=>{console.log(`Server is listening on port ${port}`)})


