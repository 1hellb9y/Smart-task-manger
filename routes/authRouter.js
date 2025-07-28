const express=require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const auth = require("../middlwares/authMiddlware");
const { getMyTasks, getMyTaskSummary } = require("../controllers/taskController");
const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",auth,getMe);
router.get("/me/tasks",auth,getMyTasks);
router.get("/me/summary",auth,getMyTaskSummary)
module.exports=router;