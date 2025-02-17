const app = require('./app')
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path : './config.env'})

const connection = mongoose.connect(process.env.CONNECTION).then(el=>{
    console.log('connection establish')
})

const port = 4000


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // React frontend ka URL
    methods: ["GET", "POST"]
  }
});

// Client connect hone par
const order = require('./controller/auth.controller')
io.on("connection", (socket) => {
    
    socket.on('placed', async(el)=>{
      const orders = await order.codAndPlacingOrderSocket(el)
    io.emit('orderPlacedResponse', { success: true, order: orders });
     
    })
  
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`); 
    });
  });


server.listen(4000, ()=>{
    console.log('server live at 4000')
})



