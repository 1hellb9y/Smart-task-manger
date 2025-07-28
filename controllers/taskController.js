const Task=require("../models/Task-Model");
const asyncHandler=require("../utils/asyncHandler");
const User=require("../models/User-Model");

exports.getAllTasks=asyncHandler(async(req,res)=>{
    const {page=1,limit=10,status,search,dueDate}=req.query;
    const filter={};
    if(status){
        filter.status=status;
    };
    if (dueDate) {
    filter.dueDate = { $lte: new Date(dueDate) };
    }
    if(search){
        filter.title={$regex:search,$options:"i"};
    };
    const tasks=await Task.find(filter).populate("createdBy","name email").skip((page-1)*limit).limit(parseInt(limit));
    const totalTasks = await Task.countDocuments(filter);
    return res.status(200).json({
        total:totalTasks,
        currentPage:parseInt(page),
        totalPages:Math.ceil(totalTasks/limit),
        tasks,
    });
});
exports.getTaskById=asyncHandler(async(req,res)=>{
    const taskId=req.params.id;
    const task=await Task.findById(taskId).populate("createdBy","name email");
    if(!task){
        return res.status(400).json({
            msg:"no task with this id"
        })
    };
    return res.status(200).json({
        task:task
    });
});
exports.createTask=asyncHandler(async(req,res)=>{
    const {title,description,dueDate}=req.body;
    if(!title || !description ||!dueDate){
        return res.status(400).json({
            msg:"some informations are missing"
        });
    };
    const newTask=new Task({
        title,
        description,
        dueDate,
        createdBy:req.user.id
    });
    await newTask.save();
    return res.status(200).json({
        msg:"new task added ",
        newTask
    })
})
exports.updateTask=asyncHandler(async(req,res)=>{
    const taskId=req.params.id;
    const updatedData=req.body;
    const userId=req.user.id;

    const task=await Task.findById(taskId);
    if(!task){
        return res.status(400).json({
            msg:"cannot find any task with this id ",
        });
    };
    if(task.createdBy.toString()!==userId){
        return res.status(400).json({
            msg:"You are not allowed to update this task "
        })
    }
    const updatedTask=await Task.findByIdAndUpdate(taskId,updatedData,{
        new:true,
        runValidators:true,
    });
    return res.status(200).json(updatedTask);
});

exports.deleteTask=asyncHandler(async(req,res)=>{
    const taskId=req.params.id;
    const userId=req.user.id;
    const task=await Task.findById(taskId);
    if(!task){
        return res.status(400).json({
            msg:"cannot find task with this id"
        })
    };
    if(task.createdBy.toString()!==userId){
        return res.status(400).json({msg:"you are not allowed to delete this task"});
    };
    const deletedTask=await Task.findByIdAndDelete(taskId);
    return res.status(200).json({
        msg:"task deleted succefully"
    });
});
exports.getMyTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search, dueDate } = req.query;
  const userId = req.user.id;

  const filter = { createdBy: userId };

  if (status) {
    filter.status = status;
  }

  if (dueDate) {
    filter.dueDate = { $lte: new Date(dueDate) };
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const tasks = await Task.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ dueDate: 1 });

  const totalTasks = await Task.countDocuments(filter);

  res.status(200).json({
    total: totalTasks,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalTasks / limit),
    tasks,
  });
});
exports.getMyTaskSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // العد حسب الحالة
  const statusCounts = await Task.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  // تحويل الـ array إلى كائن
  const summary = {
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    overdue: 0
  };

  statusCounts.forEach((item) => {
    if (item._id === "completed") summary.completed = item.count;
    if (item._id === "pending") summary.pending = item.count;
    if (item._id === "in-progress") summary.inProgress = item.count;
    if (item._id === "cancelled") summary.cancelled = item.count;
    summary.total += item.count;
  });

  // حساب المتأخرة
  const overdueCount = await Task.countDocuments({
    createdBy: userId,
    status: { $ne: "completed" },
    dueDate: { $lt: new Date() }
  });

  summary.overdue = overdueCount;

  return res.status(200).json(summary);
});


