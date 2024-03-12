const Product = require('./../model/product.model')
const SignUp = require('./../model/auth.model')
const mongoose = require('mongoose')
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const jwt = require('jsonwebtoken')
const {promisify} = require('util')

exports.addingProduct = async(req, res, next)=>{
    const {name, price, variety} = req.body;
    const addproduct = await Product.create({name, price, variety})
    res.status(200).json({
        status : 'success',
        data : {
            message : 'product added su'
        }
    })
}

exports.sendingAllvariety = async(req, res, next)=>{
    const items = await Product.find()
    const token =localStorage.getItem('b2cToken')
    const decode = await promisify(jwt.verify)(token, process.env.STRING)
    const findingUser = await SignUp.findById(decode.id)
    const nameArr = []
    findingUser.cart.forEach(el=>{
        nameArr.push(el.itemName)
    })
    res.status(200).json({
        status : 'success',
        data : {
            nameArr,
            items
        }
    })

}

exports.updatingProductPrice = async(req, res, next)=>{
    const {name, price} = req.body;
    const items = await Product.find({name : name})
    items[0].price = price
    items[0].save()
    res.status(200).json({
        status : 'success',
        data : {
            items,
            message : 'updated'
        }
    })
}

exports.makingBulkOrderValues = async(req, res, next)=>{
    const allProdcuts = await Product.find()
    const nameOfProductsArr  = []

    allProdcuts.forEach(el=>{
        nameOfProductsArr.push(el.name)
    })

    const ALlPlacedOrders = await SignUp.find()
    const allOrderArr = []
    ALlPlacedOrders.forEach(el=>{
        allOrderArr.push(...el.placed_orders)
    })

    const listItems = []
    allOrderArr.forEach(el=>{
        listItems.push(...el.item_list)
    })

    let bulkunits = 0;
    const bulkData = []

    nameOfProductsArr.forEach(el=>{
        listItems.forEach(item=>{
            if(el.toLowerCase()===item.itemName.toLowerCase()){
                bulkunits += Number(item.units)
            }
        })
        bulkData.push({
            name : el,
            units : bulkunits
        })
        bulkunits = 0
    })

    const finalBulkData = bulkData.filter(el=>{
        if(el.units!=0){
            return el
        }
    })

    console.log(finalBulkData)

    res.status(200).json({
        status : 'success',
        data : {
            finalBulkData
        }
    })
}



exports.sendingAllPlacedOrders = async(req, res, next)=>{
    const allOrders = await SignUp.find()
    const placed_orders = []
    allOrders.forEach(el=>{
        placed_orders.push(...el.placed_orders)
    })

    res.status(200).json({
        status : 'success',
        data : {
            placed_orders
        }
    })
}

exports.markingProductPackedAsDone = async(req, res, next)=>{
    const {order_id, customer_id} = req.body;
    const findingUser = await SignUp.find()
    const filteressUser = findingUser.filter(el=>{
        if(String(el._id)===customer_id){
            return el
        }
    })

    const orders = filteressUser[0].placed_orders
    
    orders.forEach(el=>{
        console.log(String(el._id)===order_id)
        console.log(String(el._id))
        console.log(order_id)

        if(String(el._id)===order_id){
            el.packed = 'packed'
        } 
    })
    filteressUser[0].save()
    
    const allOrders = await SignUp.find()
    const placed_orders = []
    allOrders.forEach(el=>{
        placed_orders.push(...el.placed_orders)
    })

    res.status(200).json({ 
        status : 'success',
        data : {
            message : 'packed',
            placed_orders : placed_orders
        }
    })
}

exports.markingProductDeliveredAsDone = async(req, res, next)=>{
    const {order_id, customer_id} = req.body;
    const findingUser = await SignUp.find()
    const filteressUser = findingUser.filter(el=>{
        if(String(el._id)===customer_id){
            return el
        }
    })

    const orders = filteressUser[0].placed_orders
    
    orders.forEach(el=>{
        console.log(String(el._id)===order_id)
        console.log(String(el._id))
        console.log(order_id)

        if(String(el._id)===order_id){
            el.delivered = 'delivered'
        } 
    })
    filteressUser[0].save()
    
    const allOrders = await SignUp.find()
    const placed_orders = []
    allOrders.forEach(el=>{
        placed_orders.push(...el.placed_orders)
    })

    res.status(200).json({ 
        status : 'success',
        data : {
            message : 'delivered',
            placed_orders : placed_orders
        }
    })
}


exports.markingProductCODAsDone = async(req, res, next)=>{
    const {order_id, customer_id} = req.body;
    const findingUser = await SignUp.find()
    const filteressUser = findingUser.filter(el=>{
        if(String(el._id)===customer_id){
            return el
        }
    })

    const orders = filteressUser[0].placed_orders
    
    orders.forEach(el=>{
        console.log(String(el._id)===order_id)
        console.log(String(el._id))
        console.log(order_id)

        if(String(el._id)===order_id){
            el.payment_status = 'success'
        } 
    })
    filteressUser[0].save()
    
    const allOrders = await SignUp.find()
    const placed_orders = []
    allOrders.forEach(el=>{
        placed_orders.push(...el.placed_orders)
    })

    res.status(200).json({ 
        status : 'success',
        data : {
            message : 'delivered',
            placed_orders : placed_orders
        }
    })
}


