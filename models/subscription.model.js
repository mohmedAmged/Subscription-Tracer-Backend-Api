import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: [2, 'Subscription name must be at least 2 characters long'],
        maxLength: [100, 'Subscription name must be at most 100 characters long'],
    },
    price:{
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be at least 0'],
    },
    currency:{
        type: String,
        enum: ['USD','EUR','EGP'],
        default:'USD',
        required: [true, 'Currency is required'],
    },
    frequency:{
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category:{
        type:String,
        enum:['entertainment','education','productivity','health','other'],
        default:'other',
        required:[true,'Category is required']
    },
    paymentMethod:{
        type:String,
        enum:['credit_card','debit_card','paypal','bank_transfer','other'],
        required: true,
        trim: true
    },
    status:{
        type:String,
        enum:['active', 'cancelled', 'expired'],
        default:'active',
    },
    startDate:{
        type: Date,
        required: true,
        validate:{
            validator: (value)=> value <= new Date(),
            message: 'StartDate cannot be in the future'
        }
    },
    renewalDate:{
        type: Date,
        validate:{
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal Date must be after Start Date'
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, { timestamps: true });

// auto-calculate renewalDate before saving
subscriptionSchema.pre('save', async function(){
    if(!this.renewalDate){
        const renewalPeriods ={
            'daily': 1,
            'weekly': 7,
            'monthly': 30,
            'yearly': 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(
            this.renewalDate.getDate() + renewalPeriods[this.frequency]
        );
    }
    // auto-update status if renewalDate has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
    // next();
})
const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;