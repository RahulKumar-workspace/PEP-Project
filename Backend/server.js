import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { YSocketIO } from "y-socket.io/dist/server"
// It is a tool that locks open a permanent, instant connection between a website and a server. like a phone call bw them
// So, Instead of constantly refreshing the page to see new data, Socket.IO keeps the line wide open so they can instantly talk to each other back and forth.
// This lets both sides push data back and forth to each other anytime without waiting for a page refresh.

const app = express()
app.use(express.static("public"))


const httpServer = createServer(app)

// setting up socketio server
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: [ "GET", "POST" ]
    }
})

//inatializing
const ySocketIO = new YSocketIO(io)
ySocketIO.initialize()

// ye dono krne ke baad server side me ySocket ka setup complete ho jata h


// Health Check Route -> does not return anything. bs ye batate h ki server is working or not
app.get('/health', (req, res) => {
    res.status(200).json({
        message: "ok",
        success: true
    })
})


httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})