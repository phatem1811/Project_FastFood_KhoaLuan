import Bill from "../models/bill";
import Lineitem from "../models/lineitem";
import Product from "../models/product.js";
const _ = require('lodash');

exports.getRecommendations = async (req, res) => {
  try {
    const accountId = req.user.id;

    const bills = await Bill.find({ account: accountId })
      .populate({
        path: 'lineItem',
        populate: {
          path: 'product',
          populate: { path: 'category', select: 'name' },
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
      .value() || 'Gà rán';

    let recommendedProducts = await Product.find({
      'category.name': topCategory,
      isSelling: true,
      isStock: true,
    })
      .populate('category', 'name')
      .limit(5)
      .lean();

    if (recommendedProducts.length < 5) {
      const topProducts = await LineItem.aggregate([
        {
          $group: {
            _id: '$product',
            totalQuantity: { $sum: '$quantity' },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 - recommendedProducts.length },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $match: {
            'product.isSelling': true,
            'product.isStock': true,
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.category',
            foreignField: '_id',
            as: 'product.category',
          },
        },
        { $unwind: '$product.category' },
        {
          $project: {
            _id: '$product._id',
            name: '$product.name',
            picture: '$product.picture',
            price: '$product.price',
            currentPrice: '$product.currentPrice',
            category: '$product.category.name',
          },
        },
      ]);

      recommendedProducts = [...recommendedProducts, ...topProducts];
    }

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};