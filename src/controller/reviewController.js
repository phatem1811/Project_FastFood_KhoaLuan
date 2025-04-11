import { reviewService } from "../services/reviewService";
import { StatusCodes } from "http-status-codes";



const createNew = async (req, res, next) => {
    try {
      
        const createNew = await reviewService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getReviewsByProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewService.getByProduct(productId);
        res.status(200).json(reviews);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const getList = async (req, res, next) => {
    try {
        const review = await reviewService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", review });
    }
    catch (error) {
        next(error);
    }
}

const markAllAsRead = async (req, res, next) => {
    try {
      const result = await reviewService.markAllAsRead();
      res.status(StatusCodes.OK).json({
        message: "Đã đánh dấu tất cả đánh giá là đã đọc",
        result,
      });
    } catch (error) {
      next(error);
    }
  };
  
  const fixIsReadField = async (req, res, next) => {
    try {
      const result = await reviewService.fixIsRead();
      res.status(200).json({ message: "Cập nhật thành công", updated: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const reviewController = {
    createNew, getReviewsByProduct, getList, markAllAsRead, fixIsReadField
}
