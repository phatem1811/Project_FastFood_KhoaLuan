import express from "express";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB.js";
import { APIs } from "./routers/v1/index.js";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";
import cors from "cors";
import http from "http";
import { socketServer } from "./socketserver.js"; 

const PayOS = require('@payos/node');
const app = express();
const server = http.createServer(app);

socketServer.init(server);

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

app.use(cors({
  origin: '*', 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"], 
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const hostname = "localhost";
const port = 8080;

connection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
server.listen(port, "0.0.0.0", () => {
  console.log(`I am running at http://${hostname}:${port}`);
});
