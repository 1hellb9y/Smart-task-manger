const mongoose=require("mongoose");
const UserShema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name of user is required"],
        trim:true,
        lowercase:true,
        
    },
    email:{
        type:String,
        required:[true,"Email of user is required"],
        trim:true,
        lowercase:true,
         match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        min:6,
        max:20,
    },
    role:{
        type:String,
        enum:["admin","manager","user"],
        default:"user",
    },

});
const userModel=mongoose.model("User",UserShema);
module.exports=userModel;