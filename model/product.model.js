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
    
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;
