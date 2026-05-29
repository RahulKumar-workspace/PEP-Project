import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { YSocketIO } from "y-socket.io/dist/server"
// It is a tool that locks open a permanent, instant connection between a website and a server. like a phone call bw them
// So, Instead of constantly refreshing the page to see new data, Socket.IO keeps the line wide open so they can instantly talk to each other back and forth.
// This lets both sides push data back and forth to each other anytime without waiting for a page refresh.

const app = express()
app.use(express.static("public")) //it means ki 'public' folder ke ander job bhi content rhega, backend server will start serving that too.
// or public folder contains all the content from /frontend/dist folder
// -> with this when we call for port 3000(backend), we'll be able to access port 5173(frontend) too, without explictly doing 'npm run dev' in 'frontend' folder.
/*
STEPS:
    - FRONTEND -> Build[num run build] -> creates a 'dist' folder[html,css,javascript]
    - copy the dist folder content in /backend/public/ folder
    - use apt.use(express.static("public"))
    - run backend server
*/

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