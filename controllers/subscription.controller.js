import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        })
        let origin = SERVER_URL;
        if (!origin || !/^https?:\/\//i.test(origin)) {
            const forwardedProto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0];
            origin = `${forwardedProto}://${req.get('host')}`;
        }
        const destination = `${origin.replace(/\/$/, '')}/api/v1/workflows/subscription/reminder`;
        let workflowRunId = null;
        try {
            const result = await workflowClient.trigger({
                url: destination,
                body: { subscriptionId: subscription.id },
                headers: { 'content-type': 'application/json' },
                retries: 0
            });
            workflowRunId = result?.workflowRunId ?? result?.run?.id ?? null;
        } catch (wfError) {
            // non-fatal: log and continue so subscription creation still succeeds
            console.error('Failed to trigger workflow (non-fatal):', wfError?.message || wfError);
        }
        res.status(201).json({success: true, message: "Subscription created successfully", data: { subscription, workflowRunId } })
        // const {workflowRunId} =await workflowClient.trigger({
        //     url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        //     body:{
        //         subscriptionId: subscription.id,
        //     },
        //     headers:{
        //         'content-type': 'application/json'
        //     }, 
        //     retries: 0
        // })
        // res.status(201).json({success: true, message: "Subscription created successfully", data: {subscription, workflowRunId} })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) =>{
    try {
        // check if the logged in user is requesting their own subscriptions
        if (req.user.id != req.params.id) {
            const error = new Error("Unauthorized access to subscriptions");
            error.status = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({user: req.params.id});
        res.status(200).json({success: true, message: "User subscriptions fetched successfully", data: subscriptions })
    } catch (error) {
        next(error)
    }
}

export const getAllSubscriptions = async (req, res, next) =>{
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({success: true, message: "All subscriptions fetched successfully", data: subscriptions })
    } catch (error) {
       next(error); 
    }
}
export const getSubscriptionById = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({success: true, message: "Subscription fetched successfully", data: subscription })
    } catch (error) {
       next(error) 
    }
}

export const updateSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!subscription){
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({success: true, message: "Subscription updated successfully", data: subscription })
    } catch (error) {
        next(error)
    }
}

export const deleteSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if(!subscription){
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({success: true, message: "Subscription deleted successfully", data: null })
    } catch (error) {
        next(error);
    }
}

// export  const getUpcomingRenewals = async (req, res, next) =>{
//     try {
//         const today = new Date();
//         const upcomingDate = new Date();
//         upcomingDate.setDate(today.getDate() + 7); 
//         const subscriptions = await Subscription.find({
//             renewalDate: { $gte: today, $lte: upcomingDate }
//         });
//         res.status(200).json({success: true, message: "Upcoming renewals fetched successfully", data: subscriptions })
//     } catch (error) {
//         next(error)
//     }
// }

export const cancelSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }
        subscription.status = 'cancelled';
        await subscription.save();
        res.status(200).json({success: true, message: "Subscription cancelled successfully", data: subscription })
    } catch (error) {
        next(error)
    }
}

export const activateSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }
        subscription.status = 'active';
        await subscription.save();
        res.status(200).json({success: true, message: "Subscription activated successfully", data: subscription })
    } catch (error) {
        next(error);
    }
}