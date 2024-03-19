const SignUp = require('./../model/auth.model')
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const Razorpay = require('razorpay');
const Product = require('./../model/product.model')
const bcrypt = require('bcryptjs')
const Complain = require('./../model/compain.model')

exports.createAccount = async(req, res, next)=>{
    const {username, email, password, address, phone,key} = req.body;
    const checkingAlreadyExist = await SignUp.find({email : email})
    if(checkingAlreadyExist.length>0){
        res.status(200).json({
            status : 'error',
            data : {
                message : `This Account already exists`
            }
        }) 
        return 
    }
    const passwordCrypted = await bcrypt.hash(password, 12)
    const createAcc = await SignUp.create({username, email, password : passwordCrypted, address, phone, key})
    const token = await jwt.sign({id : createAcc._id},process.env.STRING)
    // localStorage.setItem('b2cToken', token)

    res.status(200).json({
        status : 'success',
        data : {
            token : token,
            acc : createAcc,
            message : `welcome remeber this secret key ${key} for future use`
        }
    })
}

exports.Login = async(req, res, next)=>{
    const {email, password} = req.body;
    const findingUser = await SignUp.find({email : email})
    if(findingUser.length===0){
        res.status(200).json({
            status : 'error',
            data : {
                message : 'invalid email or password'
            }
        })
        return;
    }    
    // checking password
    const passCheck = await bcrypt.compare(password,findingUser[0].password)
    
    if(!passCheck){
        res.status(200).json({
            status : 'error',
            data : {
                
                message : 'invalid email or password'
            }
        })
        return
    }
    const token = await jwt.sign({id : findingUser[0]._id},process.env.STRING)
    // localStorage.setItem('b2cToken', token)

    res.status(200).json({
        status : 'success',
        data : {
            token : token,
            message : 'Welcome to order fresh life'
        }
    })
}

exports.forgotPassword = async(req, res, next)=>{
    const {email,key,password} = req.body;
    const findingUser = await SignUp.find({email : email})
    if(findingUser.length===0){
        res.status(200).json({
            status : 'error',
            data : {
                message : 'invalid email'
            }
        })
        return;
    } 
    let token = ''
    if(findingUser[0].key === key){
        findingUser[0].password = await bcrypt.hash(password, 12)
        token = await jwt.sign({id : findingUser[0]._id},process.env.STRING)
        // localStorage.setItem('b2cToken', token)
    }else{
        res.status(200).json({
            status : 'success',
            data : {
                message : 'invalid security key'
            }
        })
    }

    findingUser[0].save()
    res.status(200).json({
        status : 'success',
        data : {
            token,
            message : 'password changed you can login now'
        }
    })
}

exports.LoggingOut = async(req, res,next)=>{
    localStorage.removeItem('b2cToken')
    res.status(200).json({
        status : 'success',
        data : {
            message : 'you are logged out'
        }
    })
}

exports.cartPreperation = async(req, res, next)=>{
    const {itemName, units, price,token} = req.body;
    // const token =localStorage.getItem('b2cToken')
    const items = await Product.find()

    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                items : items,
                cart : [],
                nameArr : [],
                pricegross : 0,
                message : 'please login or create your account first'
            }
        }) 
        return 
    }

    console.log('sdssdx')

    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    
    findingUser.cart.push({
        itemName,
        units,
        price
    })
    findingUser.save() 

    console.log(findingUser)

    const nameArr = []
    findingUser.cart.forEach(el=>{
        nameArr.push(el.itemName)
    })

    const itemsSendableArray = []
    items.forEach(el=>{
        const obj = {
            name : el.name,
            price : el.price,
            quantity : 0,
            variety : el.variety
        }
        itemsSendableArray.push(obj)
    })
    const cart = findingUser.cart
    let pricegross = 0;
    cart.forEach(el=>{
        itemsSendableArray.forEach(item=>{
            if(item.name===el.itemName){
                item.quantity = el.units
            }
        })
        pricegross = Number(el.price.split('/-')[0]*el.units) + pricegross
    })

    res.status(200).json({
        status : 'success',
        data : {
            items : itemsSendableArray,
            cart : findingUser.cart,
            nameArr,
            pricegross,
            message :  `${itemName} added , you can change quantity in cart section`
        }
    })

}

exports.sendingAlreadyAddedCart = async(req, res, next)=>{
    const {token} = req.body
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                cart :[],
                combo: [],
                subTotal : 0,
                total : 0
            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    let cart = findingUser.cart
    let grossprice = 0
    cart.forEach(el=>{
        grossprice = Number(grossprice) + Number(el.price.split('/-')[0]*el.units)
    })
    const delivery = 20;
    const tax = 0;
    const platform = 2;
    const total = grossprice + delivery + grossprice*(tax/100) + platform

    // combos
    const combo = findingUser.combos;
    const allComboitemList = combo.map(el=>{
        return el.list;
    })
    const distributinglist = []
    allComboitemList.forEach(el=>{
        distributinglist.push(...el)
    })

    res.status(200).json({
        status : 'success',
        data : {
            cart :cart,
            combo,
            subTotal : grossprice,
            total
        }
    })
}


exports.updatingUnits = async(req, res, next)=>{
    const {units, name} = req.body;
    console.log(units)
    const {token} = req.body
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                message : 'please login or open your account first'
            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const cart = findingUser.cart
    cart.forEach(el=>{
        if(el.itemName===name){
            el.units = units
        }
    })

    findingUser.save()

    const itemsSendableArray = []
    const items = await Product.find()
    items.forEach(el=>{
        const obj = {
            name : el.name,
            price : el.price,
            quantity : 0,
            variety : el.variety
        }
        itemsSendableArray.push(obj)
    })
    let price = 0
    cart.forEach(el=>{
        itemsSendableArray.forEach(item=>{
            if(item.name===el.itemName){
                item.quantity = el.units
            }
        })
        price = Number(el.price.split('/-')[0]*el.units) + price
    })
    console.log(price)

    res.status(200).json({
        status : 'success',
        data : {
            items : itemsSendableArray,
            message : 'updated',
            price
        }
    })
}

exports.deletingCartItem = async(req, res, next)=>{
    const {name, token} = req.body
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const cart = findingUser.cart
    const updatedCart = cart.filter(el=>{
        if(el.itemName!==name){
            return el
        }
    })
    findingUser.cart = updatedCart
    findingUser.save()
    res.status(200).json({
        status : 'success',
        data : {
            cart : findingUser.cart,
            message : `${name} deleted successfully`    
        }
    })
}

exports.deleteCompleteCart = async(req, res, next)=>{
    const token =localStorage.getItem('b2cToken')
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    findingUser.cart = []
    findingUser.save()
    res.status(200).json({
        status : 'success',
        data : {
            cart : findingUser.cart,
            message : 'your cart is empty now!' 
        }
    })
}

exports.sendingCartItemsOnlyWithoutCalculations = async(req, res, next)=>{
    const {token} =req.body
    console.log(token)
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                cart : []
            }
        })
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const cart = findingUser.cart
    res.status(200).json({
        status : 'success',
        data : {
            cart : cart ? cart : []
        }
    })
}

exports.onlinePayment = async(req, res, next)=>{
    const {token} = req.body
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const cart = findingUser.cart
    let grossprice = 0
    cart.forEach(el=>{
        grossprice = Number(grossprice) + Number(el.price.split('/-')[0]*el.units)
    })
    const delivery = 20;
    const tax = 0;
    const platform = 2;
    const total = grossprice + delivery + grossprice*(tax/100) + platform
    
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET })
    var options = {
        amount: total*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    instance.orders.create(options, function(err, order) {
        console.log(order);
        res.status(200).json({
            status : 'success',
            data : {
                id : order.id
            }
        })
    });

}

const crypto = require('crypto')

exports.validatingPays = async(req, res, next)=>{
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
    
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET })
    let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET); 
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
    const generated_signature = hmac.digest('hex')
    if(razorpay_signature===generated_signature){ 
        const {token} = req.body;
        const decode = await promisify(jwt.verify)(token, process.env.STRING)
        const findingUser = await SignUp.findById(decode.id)
        const cart = findingUser.cart
        let grossprice = 0
        cart.forEach(el=>{
            grossprice = Number(grossprice) + Number(el.price.split('/-')[0]*el.units)
        })
        const delivery = 20;
        const tax = 0;
        const platform = 2;
        const total = grossprice + delivery + grossprice*(tax/100) + platform
        
        findingUser.placed_orders.push({
            item_list : findingUser.cart,
            subtotal : grossprice,
            delivery : delivery,
            tax : tax,
            platform : platform,
            total : total,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            payment_mode : 'online',
            payment_status : 'success',
            creds : [findingUser.username, findingUser.address, findingUser.phone],
            client_id : findingUser._id
        })
    
        
        findingUser.cart = []
        
        findingUser.save()
    
        res.status(200).json({
            status : 'success',
            data : {
                message : 'order placed sucessfully'
            }
        })

    } else{
        res.status(200).json({
            status : 'success',
            data : {
                message : 'Payment failed please try again or place cash on delivery order'
            }
        })
    }

}


exports.codAndPlacingOrder = async(req, res, next)=>{
    const {token} = req.body
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const cart = findingUser.cart
    let grossprice = 0
    cart.forEach(el=>{
        grossprice = Number(grossprice) + Number(el.price.split('/-')[0]*el.units)
    })
    const delivery = 20;
    const tax = 0;
    const platform = 2;
    const total = grossprice + delivery + grossprice*(tax/100) + platform
    
    findingUser.placed_orders.push({
        item_list : findingUser.cart,
        subtotal : grossprice,
        delivery : delivery,
        tax : tax,
        platform : platform,
        total : total,
        razorpay_payment_id : '',
        razorpay_order_id : '',
        razorpay_signature : '',
        payment_mode : 'cod',
        payment_status : 'pending',
        creds : [findingUser.username, findingUser.address, findingUser.phone],
        client_id : findingUser._id
    }) 
 
    
    findingUser.cart = []
    
    findingUser.save()
    res.status(200).json({
        status : 'success',
        data : {
            message : 'order placed sucessfully'
        }
    })
}

exports.sendingPlacedOrder = async(req, res, next)=>{
    const {token} =req.body
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                placed_orders : [],
                message : 'Please login to see all placed orders'
            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const placed_orders = findingUser.placed_orders
    res.status(200).json({
        status : 'success',
        data : {
            placed_orders,
            message : "You don't have any placed orders"

        }
    })

}


exports.feedback = async(req, res, next)=>{
    const {feedbackMessage, token} = req.body;
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                message : 'Please login or create account first'

            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    findingUser.feedback.push({
        message : feedbackMessage
    })

    findingUser.save()

    res.status(200).json({
        status : 'success',
        data : {
            message : 'Thankyou very much , we will consider your feedback'
        }
    })
}


exports.complain = async(req, res, next)=>{
    const {subject, description, token} = req.body;
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                message : 'Please login or create account first'

            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const complaincreate = await Complain.create({subject, description, user : findingUser._id})
    res.status(200).json({
        status : 'success',
        data : {
            message : 'Complain registered our team will contact you in next 24hrs'
        }
    })
}


exports.PuttingComboToCart = async(req, res, next)=>{
    const {list} = req.body;
    const token =localStorage.getItem('b2cToken')
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                message : 'Please login or create account first'

            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    findingUser.combos.push({list})
    console.log(list)
    findingUser.save()
    res.status(200).json({
        status : 'success',
        data : {
            message : 'combo added'
        }
    })
}

exports.sendingUSerData = async(req, res, next)=>{
    const {token} =req.body
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                user : {},
                message : 'Please login or create account first'

            }
        })  
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    res.status(200).json({
        status : 'success',
        data : {
            user : findingUser
        }
    })
}

exports.changeAddress = async(req, res, next)=>{
    const {address,token} = req.body;
    if(token==='logout'){
        res.status(200).json({
            status : 'success',
            data : {
                message : 'Login or create your account'
            }
        })
        return
    }
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    findingUser.address = address
    res.status(200).json({
        status : 'success',
        data : {
            user : findingUser
        }
    })
}

var timeout = require('connect-timeout')
const { Infobip, AuthType } =  require('@infobip-api/sdk');
var https = require('follow-redirects').https;
var fs = require('fs');
const {PythonShell} = require('python-shell')

exports.code = async(req, res, next)=>{
    let options = {
        scriptPath : __dirname,
        args : ['john', 45]
    }

    PythonShell.run('py.py', options).then(messages=>{
        console.log('finished');
            res.status(200).json({
                status : 'success',
            })
    });

}
