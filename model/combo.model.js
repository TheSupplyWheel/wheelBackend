const mongoose = require('mongoose')

const comboSchema = new mongoose.Schema({
    date : {
        type : String,
        default : new Date().toLocaleDateString()
    }
    ,
    price : {
        type : String
    }
    ,
    comboProduct : [{
        name : {
            type : String
        }
        ,
        quantity : {
            type : String
        }
    }]
})


const combo = mongoose.model('combo', comboSchema)

module.exports = combo