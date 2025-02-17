const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    username : {
        type : String
    }
    ,
    email : {
        type : String
    }
    ,
    password : {
        type : String
    } 
    ,
    address : {
        type : String
    }
    ,
    phone : {
        type : String
    }
    ,
    key : {
        type : String
    }
    ,
    cart : [{
        itemName : {
            type : String
        }
        ,
        price : {
            type : String
        }
        ,
        units : {
            type : String
        }
        ,
        date : {
            type : String,
            default : new Date().toLocaleDateString()
        }
    }]
    ,
    combos : [{
        list : {
            type : Array
        }
        ,
        date : {
            type : String,
            default : new Date().toLocaleDateString()
        }
    }]
    ,
    placed_orders : [{
        item_list : {
            type : Array
        }
        ,
        date : {
            type : String,
            default : new Date().toLocaleDateString()
        }
        ,
        time : {
            type : String,
            default : new Date().toLocaleTimeString()
        }
        ,
        subtotal : {
            type : Number
        }
        ,
        delivery : {
            type : Number
        }
        ,
        tax : {
            type : Number
        }
        ,
        platform : {
            type : Number
        }
        ,
        total : {
            type : Number
        }
        ,
        razorpay_payment_id : {
            type : String,
        }
        ,
        razorpay_order_id : {
            type : String,
        }
        ,
        razorpay_signature : {
            type : String,
        }
        ,
        payment_mode : {
            type : String,
            enum : ['cod', 'online']
        }
        ,
        payment_status : {
            type : String,
            enum : ['pending', 'success', 'failed']
        }
        , 
        creds : {
            type : Array
        }
        ,
        client_id : {
            type : String
        }
        ,
        packed : {
            type : String,
            enum : ['not packed', 'packed']
        }
        ,
        delivered : {
            type : String,
            enum : ['not delivered', 'delivered']
        }
        ,
        outForDelivery : {
            type : String,
            enum : ['not out', 'out']
        }
        ,
        refund_status : {
            type : String,
            enum : ['no refund', 'will refund', 'refunded']
        }
        ,
        delivery_boy : {
            type : String
        }
        ,
        delivery_boy_phone : {
            type : String
        }
    }]
    ,
    feedback : [{
        message : {
            type : String
        }
    }]
    ,
    refund_orders : [{
        refundOrder : {
            type : Array
        }
    }]
    
})

const SignUp = mongoose.model('SignUp', signupSchema)

module.exports = SignUp