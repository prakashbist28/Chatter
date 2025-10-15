const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute")
const User = require('./models/usermodel'); // <-- **MUST** import the User model here to use findByIdAndUpdate

const app= express();
const socket = require('socket.io');

require('dotenv').config(); 

app.use(cors());
app.use(express.json());
 
app.use("/api/auth",userRoutes)
app.use("/api/messages", messageRoute )

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log("DB connection successful")
}).catch((err)=>{
    console.log(err.message)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`)
});

const io = socket(server, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = ["http://localhost:3000", "https://chatter-pb.onrender.com"];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }
});


global.onlineUsers = new Map()

io.on("connection", (socket) => {
        global.chatSocket = socket;
      
        //  user connects
        socket.on("add-user", async (userId) => {
          onlineUsers.set(userId, socket.id);
          await User.findByIdAndUpdate(userId, { isOnline: true });
      
          //Broadcasting to ALL users (not just one)
          const currentOnlineUserIds = Array.from(onlineUsers.keys());
          io.emit("get-online-users", currentOnlineUserIds);

          // Notifying about specific user going online
          socket.broadcast.emit("user-status-changed", { userId, isOnline: true });
        });
      
        // When a message is sent (unchanged)
        socket.on("send-msg", (data) => {
          const sendUserSocket = onlineUsers.get(data.to);
          if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
          }
        });
      
        // When user disconnects
        socket.on("disconnect", async () => {
          const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
      
          if (userId) {
            onlineUsers.delete(userId);
            await User.findByIdAndUpdate(userId, { isOnline: false });
      
            // Broadcast updated full list again — force UI sync
            const updatedOnlineUserIds = Array.from(onlineUsers.keys());
            io.emit("get-online-users", updatedOnlineUserIds);
      
            // Notify others that user is offline
            socket.broadcast.emit("user-status-changed", { userId, isOnline: false });
          }
        });
      });
      