import express from "express";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB.js";
import { APIs } from './routers/v1/index.js';
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";
import { createBillSocket } from "./services/billService.js";
import cors from 'cors';
import http from 'http'; 
import socketIo from 'socket.io';

const app = express();
const server = http.createServer(app); 


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

const hostname = 'localhost';
const port = 8080;

connection();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  
  socket.on('createBill', async (billData) => {
    try {
      const bill = await createBillSocket(billData);
  
      io.emit('billCreated', {
        status: 'success',
        data: bill,
        message: 'Bill created successfully!',
      });
    } catch (error) {
      console.error('Error creating bill:', error);
  
      io.emit('billCreated', {
        status: 'error',
        message: 'Failed to create bill',
      });
    }
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

app.use("/v1", APIs);

// Xử lý lỗi toàn cục
app.use(errorHandlingMiddleware);

// Khởi động server
server.listen(port, hostname, () => {
  console.log(`I am running at http://${hostname}:${port}`);
});
