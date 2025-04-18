import mongoose from "mongoose";
import Product from "../models/product.js";

const getRelatedProducts = async (req, res, next) => {
  try {
    console.log("call api thành công");
    const id = req.params.id;
    console.log("check id", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("ID sản phẩm không hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    const currentProduct = await Product.findById(id)
      .populate("category", "name")
      .lean();


      console.log("check currentProduct", currentProduct);
    if (!currentProduct) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    if (!currentProduct.category || !currentProduct.category._id) {
      const error = new Error("Sản phẩm không có danh mục hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    let relatedProducts = await Product.find({
      category: currentProduct.category._id,
      _id: { $ne: id },
      isSelling: true,
      isStock: true,
    })
      .populate("category", "name")
      .limit(5)
      .lean();

    if (relatedProducts.length < 5) {
      const topProducts = await Product.aggregate([
        {
          $match: {
            isSelling: true,
            isStock: true,
            _id: { $ne: new mongoose.Types.ObjectId(id) }
          },
        },
        { $sample: { size: 5 - relatedProducts.length } },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            name: 1,
            picture: 1,
            price: 1,
            currentPrice: 1,
            category: { $ifNull: ["$category.name", "Không có danh mục"] },
          },
        },
      ]);

      relatedProducts.push(...topProducts);
    }

    res.status(200).json({
      message: "Lấy sản phẩm liên quan thành công",
      relatedProducts,
    });

  } catch (error) {
    next(error);
  }
};
export const relatedProductsController = {
  getRelatedProducts,
};
