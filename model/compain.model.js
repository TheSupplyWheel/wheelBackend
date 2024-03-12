const mongoose = require('mongoose')

const complainSchema = new mongoose.Schema({
    subject : {
        type : String
    }
    ,
    description : {
        type : String
    }
    ,
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'SignUp'
    }
})

const Complain = mongoose.model('Complain', complainSchema)

module.exports = Complain