import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async(req,res, next)=>{
    const session = await mongoose.startSession();
    // why use that ? to start a transaction what allows to make multiple operations on the database as a single unit of work
    session.startTransaction();
    try {
        // logic to create new user
        //what is req.body ? req.body contains the data sent by the client in the request body, typically in JSON format (post request)

        const {name, email, password} = req.body
        // check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            const error = new Error('User already exists with this email');
            error.statusCode = 409; // conflict
            throw error;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashedPassword}],{session})

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data:{
                token,
                user: newUsers[0]
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}
export const signIn = async(req,res, next)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data:{
                token,
                user
            }
        })
    } catch (error) {
        next(error)
    }
}
// export const signOut = async(req,res, next)=>{}