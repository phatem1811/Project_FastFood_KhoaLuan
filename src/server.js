import express from "express";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB.js";
import { APIs } from "./routers/v1/index.js";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";
import { createBillSocket } from "./services/billService.js";
import cors from "cors";
import http from "http";
import socketIo from "socket.io";

const PayOS = require('@payos/node');
const app = express();
const server = http.createServer(app);

const payos = new PayOS(
  "6124fa93-9611-43a9-b53a-3720c06a7be3",
  "2e232dca-c8ab-4d0c-bff6-c09d57f78fc9",
  "ebf1d352e8ab9b15e4ffcd27f76b4d96741e750f1e12449222b8652dee266bb5"
);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const hostname = "localhost";
const port = 8080;

connection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  socket.on("createBill", async (billData) => {
    try {
      const bill = await createBillSocket(billData);

      io.emit("billCreated", {
        status: "success",
        data: bill,
        message: "Bill created successfully!",
      });
    } catch (error) {
      console.error("Error creating bill:", error);

      io.emit("billCreated", {
        status: "error",
        message: "Failed to create bill",
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

app.use("/v1", APIs);
app.post('/create-payment-link', async (req, res) => {
  const { amount, returnUrl, cancelUrl } = req.body;

  if (!amount || !returnUrl || !cancelUrl) {
    return res.status(400).json({ message: 'Thiếu thông tin thanh toán!' });
  }

  try {
      const orderCode = Date.now();
      const paymentLink = await payos.createPaymentLink({
          amount,        // Số tiền
          currency : 'VND',      
          orderCode,
          description : 'Trang thanh toán PAYOS', 
          returnUrl ,             
          cancelUrl ,  
      });

      res.status(200).json({
          message: 'Tạo liên kết thanh toán thành công!',
          paymentLink: paymentLink.checkoutUrl,
      });
  } catch (error) {
      console.error('Lỗi khi tạo liên kết thanh toán:', error);
      res.status(500).json({
          message: 'Không thể tạo liên kết thanh toán. Vui lòng thử lại.',
          error: error.message,
      });
  }
});

// Xử lý lỗi toàn cục
app.use(errorHandlingMiddleware);

// Khởi động server
server.listen(port, hostname, () => {
  console.log(`I am running at http://${hostname}:${port}`);
});
