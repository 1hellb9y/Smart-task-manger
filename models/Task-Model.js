const mongoose=require("mongoose");
const TaskShema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title of the task is required"],
        trim:true,
        min:2
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        min:20,
        max:200,
    },
    staus:{
        type:String,
        enum:["done","pending","in-progress","canceld"],
        default:"pending"
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
        validate: {
        validator: function (value) {
            return value > Date.now();
        },
        message: "Due date must be in the future"
    }
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },

});


TaskShema.virtual("isOverdue").get(function(){
    return this.dueDate< new Date()&& this.status==="done"
})
const TaskModel=mongoose.model("Task",TaskShema);
module.exports=TaskModel