import express from "express";
import OrderNotification from "../../models/OrderNotification";
const Router = express.Router();

Router.get("/list", async (req, res) => {
  try {
    const orderNotifications = await OrderNotification.find({})
      .populate("billId")
      .sort({ createdAt: -1 });

    res.status(200).json(orderNotifications);
  } catch (error) {
    console.error("Error fetching order notifications:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thông báo" });
  }
});

Router.patch("/update-isRead/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedNotification = await OrderNotification.findByIdAndUpdate(
      id, 
      { isRead: true },
      { new: true } 
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }

    res.status(200).json(updatedNotification); 
  } catch (error) {
    console.error("Error updating order notification:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông báo" });
  }
});
Router.patch("/update-all-isRead", async (req, res) => {
  try {
    const result = await OrderNotification.updateMany(
      { isRead: false },       // Điều kiện: chỉ cập nhật những notify chưa đọc
      { $set: { isRead: true } } // Cập nhật thành true
    );

    res.status(200).json({
      message: "Cập nhật tất cả thông báo thành công",
      modifiedCount: result.modifiedCount, // Trả về số lượng đã cập nhật
    });
  } catch (error) {
    console.error("Error updating all order notifications:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật tất cả thông báo" });
  }
});
export const orderNotifyRoute = Router;
