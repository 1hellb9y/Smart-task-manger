const User=require("../models/User-Model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const SECRET_KEY=process.env.SECRET_KEY

exports.registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email ||!password){
        return res.status(400).json({
            msg:"you forget some infos"
        })
    }
    const existUser=await User.findOne({email});
    if(existUser){
        return res.status(400).json({
            msg:"this user already exist",
        });
    };
    const hashedPasswrod=await bcrypt.hash(password,10);
    const newUser=new User({
        name,email,password:hashedPasswrod
    });
    await newUser.save();

    return res.status(200).json({msg:"new user register",user:newUser.name});
});
exports.loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email ||!password){
        return res.status(400).json({
            msg:"you forget some infos"
        });
    };
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            msg:"cannot find this user",
        });
    };
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            msg:"password incorrect",
        })
    };
    const payload={
        id:user._id,
        name:user.name,
        role:user.role
    };
    const token=jwt.sign(payload,SECRET_KEY,{expiresIn:"7d"});
    return res.status(200).json({msg:"you have loggin in succesfully",token});
})

exports.getMe=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    if(userId){
        return res.status(400).json({
            msg:"you need to login in first"
        });
    };
    const user=await User.findById(userId);
    return res.status(200).json({
        msg:"welcome to your profile",
        user:user.name
    });
});
