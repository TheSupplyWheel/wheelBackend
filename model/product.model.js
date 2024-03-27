const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String
    }
    ,
    price : {
        type : Number
    }
    ,
    variety : {
        type : String
    }
    ,
    selected : {
        type : Boolean
    }
    ,
    image : {
        type : String
    }
    ,
    purchasingPrice : [{
        date : {
            type : String,
            default : new Date().toLocaleDateString()
        }
        ,
        price : {
            type : String,
        }
    }]
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;
