import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters long'],
        maxLength: [50, 'Name must be at most 50 characters long'],
    },
    email:{
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password:{
        type: String, 
        required: [true, 'Password is required'],
        minLength: 6,
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

export default User;