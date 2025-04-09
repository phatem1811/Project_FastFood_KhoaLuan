let io;
import { createBillSocket } from "./services/billService.js";
import { createReviewSocket } from "./services/reviewService.js"
import ReviewNotification from "./models/ReviewNotification.js"; 
const init = (server) => {
  const socketIo = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io = socketIo;

  io.on("connection", (socket) => {
    console.log(" User connected");

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

    socket.on("createReview", async (reviewData) => {
        try {
          const review = await createReviewSocket(reviewData);
  
          const notification = new ReviewNotification({
            reviewId: review._id,
            productId: review.product,
            message: `Đánh giá mới cho sản phẩm!`,
          });
  
          await notification.save();
  
          io.emit("review_notification", {
            message: "Bạn có đánh giá mới!",
            data: {
              review,
              notification,
            },
          });
  
        } catch (error) {
          console.error(" Error creating review:", error);
  
          socket.emit("review_notification_error", {
            message: "Tạo đánh giá thất bại.",
          });
        }
      });

    socket.on("disconnect", () => {
      console.log(" User disconnected");
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("❗Socket.IO chưa được khởi tạo!");
  }
  return io;
};

// ✅ Export dạng object
export const socketServer = {
  init,
  getIO,
};
