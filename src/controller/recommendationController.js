import mongoose from "mongoose";
import Bill from "../models/bill.js";
import LineItem from "../models/lineitem.js";
import Product from "../models/product.js";
import _ from "lodash";

const getRecommendations = async (req, res, next) => {
  try {
    const accountId = req.user.id;
    console.log("checkAccountId", accountId);

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      const error = new Error("ID tài khoản không hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    const bills = await Bill.find({ account: accountId })
      .populate({
        path: "lineItem",
        populate: {
          path: "product",
          populate: { path: "category", select: "name" },
        },
      })
      .lean();

    const categories = _.flatMap(bills, (bill) =>
      bill.lineItem.map((item) => item.product.category?.name)
    ).filter(Boolean);

    const topCategory = _.chain(categories)
      .countBy()
      .entries()
      .maxBy(([, count]) => count)
      .head()
      .value() || "Gà rán";

    let recommendedProducts = await Product.find({
      "category.name": topCategory,
      isSelling: true,
      isStock: true,
    })
      .populate("category", "name")
      .limit(8)
      .lean();

    if (recommendedProducts.length < 8) {
      const topProducts = await LineItem.aggregate([
        {
          $group: {
            _id: "$product",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 8 - recommendedProducts.length },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $match: {
            "product.isSelling": true,
            "product.isStock": true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "product.category",
            foreignField: "_id",
            as: "product.category",
          },
        },
        { $unwind: "$product.category" },
        {
          $project: {
            _id: "$product._id",
            name: "$product.name",
            picture: "$product.picture",
            price: "$product.price",
            currentPrice: "$product.currentPrice",
            category: "$product.category.name",
            description: "$product.description",
          },
        },
      ]);

      recommendedProducts = [...recommendedProducts, ...topProducts];
    }

    res.status(200).json({
      message: "Lấy sản phẩm gợi ý thành công",
      recommendedProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const recommendationController = {
  getRecommendations,
};