// server.js
require("dotenv").config();
const http=require("http");
const cors=require("cors");
const {Server}=require("socket.io");
const connectToDB=require("./src/db/db");
const app=require('./src/app')

const server=http.createServer(app);

// ✅ Middlewares
app.use(cors({
    origin: "http://localhost:5173", // React frontend
    credentials: true
}));


// ✅ Connect DB
connectToDB();

// ✅ Socket.IO setup
const io=new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
});

let users={}; // store all active users with locations

io.on("connection", (socket) =>
{
    console.log("User connected:", socket.id);

    // Send existing users to the new client
    socket.emit("existing-users", users);

    // When a user shares location
    socket.on("send-location", (data) =>
    {
        console.log("Received location data:", data);

        if (!data||typeof data.latitude!=="number"||typeof data.longitude!=="number")
        {
            console.error("Invalid location data received:", data);
            return;
        }

        // ✅ Save exact location with timestamp
        users[socket.id]={
            userId: socket.id,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: Date.now()
        };

        console.log("Updated user location:", users[socket.id]);

        // Broadcast to all clients including sender
        io.emit("receive-location", users[socket.id]);
    });

    // Handle disconnect
    socket.on("disconnect", () =>
    {
        console.log("User disconnected:", socket.id);
        delete users[socket.id];
        io.emit("user-disconnected", socket.id);
    });
});

// ✅ Simple test route
app.get("/", (req, res) =>
{
    res.send("🚀 Server & Socket.IO running!");
});

// ✅ Start server
const PORT=3000;
server.listen(PORT, () =>
{
    console.log(`Server running on http://localhost:${PORT}`);
});
