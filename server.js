const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const NodeMediaServer = require("node-media-server");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
const os = require("os");



function getServerIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const iface of networkInterface) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost"; // Default to localhost if no IP is found
}

const serverIP = getServerIP();

const serverPort = 3000;
// Configure CORS
app.use(
  cors({
    origin: "*", // Replace with the allowed origin(s) or '*' for all origins
    methods: ["GET", "POST"], // Specify the allowed HTTP methods
    credentials: true, // Set to true if your requests include credentials (e.g., cookies)
  })
);

app.use(express.static(__dirname + "/public"));

// Your existing NodeMediaServer configuration
const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*", // You can adjust this as needed
  },
});

// Event handler for incoming streams
// Inside the NodeMediaServer configuration



// Rest of the server-side code


nms.run();

io.on("connection", (socket) => {
  console.log("A user connected");

//  socket.emit("server_ip_address", serverIP);
 socket.emit("server_ip_address", serverIP);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(serverPort, () => {
  const serverLink = `http://${serverIP}:${serverPort}`;
  console.log(`Server is running on ${serverLink}`);
});