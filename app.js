const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())

app.use(cors())


var timeout = require('connect-timeout')
const authRoutes = require('./routes/auth.routes')
app.use('/api/v1/user', authRoutes)



const productRoute = require('./routes/product.routes')
app.use('/api/v1/product', productRoute)

module.exports =  app