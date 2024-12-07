import { userModel } from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";

export const registerUser = async(req,res,next)=>{
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {fullname,email,password} = req.body
    const isEmailExist = await userModel.find({email:email})

    if(isEmailExist){
        return res.status(400).json({status:false,message:"this email user already exist please login"})
    }

    const hashedPassword = await userModel.hashedPassword(password)

    const user = await createUser({firstname:fullname.firstname,lastname:fullname.lastname,email,password:hashedPassword});

    const token = user.generateAuthToken()

    res.status(201).json({ status:true,message:"user created",token,user})
}

export const loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password} = req.body

    let user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message:'Invalid email or password'})
    }

    const isMatch = await user.comparedPassword(password)

    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'})

    }
    const token = user.generateAuthToken()

    user = {
        _id:user._id,
        fullname:{
            firstname:user.fullname.firstname,
            lastname:user.fullname.lastname
        },
        email:user.email
    }

    

    return res.status(200).cookie('token',token,{
        httpOnly:true,
        sameSite:'strict',
        maxAge:10 * 24 * 60 * 60 * 1000
    }).json({message:'user is logged in',token,user})
}

export const getProfile=async(req,res,next)=>{
    const user = req.user;
    
    return res.status(200).json({message:'user profile',user})
}