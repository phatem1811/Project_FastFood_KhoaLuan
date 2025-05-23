import Review from "../models/review.js";
import Product from "../models/product.js";

const createNew = async (reqBody) => {
  try {

    const review = new Review(reqBody);
    const savedReview = await review.save();

    return savedReview;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createReviewSocket = async (reviewData) => {
  try {
    const review = new Review(reviewData);
    const savedReview = await review.save();
    return savedReview;
  } catch (error) {
    console.error("Error in createReviewSocket:", error.message);
    throw new Error(error.message);
  }
};


const getList = async () => {
  try {
    const reviews = await Review.find({})
      .populate("product")
      .sort({ createdAt: -1 });
    return reviews;
  } catch (error) {
    throw error;
  }
};


const getByProduct = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    return reviews;
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error("Không tìm thấy đánh giá");
    }
    return review;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateNew = async (id, reqBody) => {
  try {
    const updated = await Review.findByIdAndUpdate(id, reqBody, { new: true });
    if (!updated) {
      throw new Error("Không tìm thấy đánh giá.");
    }
    return updated;
  } catch (error) {
    throw error;
  }
};

const fixIsRead = async () => {
  try {
    const result = await Review.updateMany(
      { isRead: { $exists: false } },
      { $set: { isRead: false } }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const markAllAsRead = async () => {
  try {
    const result = await Review.updateMany({ isRead: false }, { isRead: true });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};


const deleteReview = async (id) => {
  try {
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Không tìm thấy đánh giá.");
    }
    return deleted;
  } catch (error) {
    throw error;
  }
};

export const reviewService = {
  createNew,
  getList,
  getByProduct,
  getById,
  updateNew,
  deleteReview,
  createReviewSocket,
  markAllAsRead,
  fixIsRead
  
};
