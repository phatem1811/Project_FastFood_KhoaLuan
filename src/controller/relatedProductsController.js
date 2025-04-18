const Product = require('../models/Product');

exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra productId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    console.log('checkProductId', id);

    // Tìm sản phẩm hiện tại
    const currentProduct = await Product.findById(id)
      .populate('category', 'name')
      .lean();

    console.log('checkCurrentProduct', currentProduct);

    if (!currentProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra category có tồn tại
    if (!currentProduct.category || !currentProduct.category._id) {
      return res.status(400).json({ message: 'Sản phẩm không có danh mục hợp lệ' });
    }

    // Tìm sản phẩm tương tự (cùng danh mục, loại trừ sản phẩm hiện tại)
    const relatedProducts = await Product.find({
      category: currentProduct.category._id,
      _id: { $ne: productId },
      isSelling: true,
      isStock: true,
    })
      .populate('category', 'name')
      .limit(5)
      .lean();

    // Nếu không đủ 5 sản phẩm, lấy sản phẩm ngẫu nhiên
    if (relatedProducts.length < 5) {
      const topProducts = await Product.aggregate([
        {
          $match: {
            isSelling: true,
            isStock: true,
            _id: { $ne: mongoose.Types.ObjectId(productId) },
          },
        },
        { $sample: { size: 5 - relatedProducts.length } },
        {
          $lookup: {
            from: 'categories', // Đảm bảo tên collection đúng
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        // Dùng $unwind với preserveNullAndEmptyArrays để giữ document nếu category rỗng
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            name: 1,
            picture: 1,
            price: 1,
            currentPrice: 1,
            category: { $ifNull: ['$category.name', 'Không có danh mục'] },
          },
        },
      ]);

      relatedProducts.push(...topProducts);
    }

    res.json(relatedProducts);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};