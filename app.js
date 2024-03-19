const express = require('express')

const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
var timeout = require('connect-timeout')
const authRoutes = require('./routes/auth.routes')
app.use('/api/v1/user', authRoutes)


function authentication(req, res, next) {
    const authheader = req.headers.authorization;
    console.log(req.headers);
 
    if (!authheader) {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }
 
    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
 
    
 
}
 
app.use(authentication)


const productRoute = require('./routes/product.routes')
app.use('/api/v1/product', productRoute)

module.exports =  app