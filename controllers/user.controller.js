import User from "../models/user.model.js";

export const getUsers = async (req, res, next)=>{
    try {
        const users = await User.find();

        res.status(200).json({success: true, message:'all users fetched succesfully', data: users})
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next)=>{
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, message:'user data fetched succesfully', data: user})
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, message:'user updated succesfully', data: user})
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, message:'user deleted succesfully', data: null})
    } catch (error) {
        next(error)
    }
}