const express=require("express");
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const auth = require("../middlwares/authMiddlware");
const checkRole = require("../middlwares/checkRole");
const router=express.Router();


router.get("/tasks",getAllTasks);
router.get("/tasks/:id",getTaskById);
router.post("/tasks",auth,checkRole(["admin","manager"]),createTask);
router.put("/tasks/:id",auth,checkRole(["admin","manager"]),updateTask);
router.delete("/tasks/:id",auth,checkRole(["admin","manager"]),deleteTask);


module.exports=router