import Product from "../models/product";
import Event from "../models/event";
import Category from "../models/category";
import Bill from "../models/bill";
const createNew = async (reqBody, imagePath) => {
  try {
    let currentPrice = reqBody.price;

    if (reqBody.event) {
      const event = await Event.findById(reqBody.event);

      if (event && event.discountPercent) {
        const discount = (reqBody.price * event.discountPercent) / 100;
        currentPrice = reqBody.price - discount;
      }
    }

    reqBody.currentPrice = currentPrice;

    const createNew = new Product(reqBody);
    const saveNew = await createNew.save();

    if (reqBody.category) {
      await Category.findByIdAndUpdate(
        reqBody.category,
        { $addToSet: { products: saveNew._id } }, 
        { new: true }
      );
    }

    return saveNew;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const products = await Product.find({})
      .populate('category',  '_id name')
      .populate("event")           
      .populate({
        path: "options",
        populate: {
          path: "choices",       
        },
      });
    return products;
  } catch (error) {
    throw error;
  }
};
const updateNew = async (id, reqBody, imagePath) => {
  try {
    let product = await Product.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm.");
    }

    let currentPrice = reqBody.price || product.price; 
    if (reqBody.event) {
      const event = await Event.findById(reqBody.event);
      if (event && event.discountPercent) {
        const discount = (currentPrice * event.discountPercent) / 100;
        currentPrice = currentPrice - discount;
      }
    }

    if (reqBody.options && Array.isArray(reqBody.options)) {
      product.options = reqBody.options;
    }
    reqBody.currentPrice = currentPrice;
    const updatedProduct = await Product.findByIdAndUpdate(id, reqBody, { new: true });
    



    const oldCategoryId = product.category;
    if (reqBody.category) {
      if (oldCategoryId && oldCategoryId.toString() !== reqBody.category) {
        await Category.findByIdAndUpdate(
          oldCategoryId,
          { $pull: { products: updatedProduct._id } }, 
          { new: true }
        );
      }

      await Category.findByIdAndUpdate(
        reqBody.category,
        { $addToSet: { products: updatedProduct._id } },
        { new: true }
      );
    }
    if (!updatedProduct) {
      throw new Error("Không thể cập nhật sản phẩm.");
    }

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};
const getProductsByCategory = async (categoryId) => {
    try {
      const products = await Product.find({ category: categoryId }); 
      return products;
    } catch (error) {
      throw error;
    }
};

const getById = async (id) => {
  try {
    const product = await Product.findById(id)
      .populate("category")       
      .populate("event")           
      .populate({
        path: "options",
        populate: {
          path: "choices",       
        },
      });


    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const unblockProduct= async (id) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { isSelling: true }, 
      { new: true }
    );

    if (!updated) {
      throw new Error("Không tìm thấy sản phẩm.");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { isSelling: false }, 
      { new: true }
    );

    if (!updated) {
      throw new Error("Không tìm thấy sản phẩm.");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};


const hardDeleteProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    await Product.findByIdAndDelete(id);
    if (product.category) {
      await Category.findByIdAndUpdate(
        product.category,
        { $pull: { products: product._id } }, 
        { new: true }
      );
    }

    return { message: "Sản phẩm đã được xóa thành công." };
  } catch (error) {
    throw error;
  }
};

const searchProductByName = async (name) => {
  try {
   
    const products = await Product.find({
      name: { $regex: name, $options: 'i' } // 'i' là để không phân biệt hoa thường
    });

    return products;
  } catch (error) {
    throw error;
  }
};

const getListPage = async (page = 1, limit = 5, searchTerm = "",  cateId = null,  isSelling = null) => {
  try {
    const skip = (page - 1) * limit;
    let searchQuery = {};
    
    if (searchTerm) {
      searchQuery = { name: { $regex: searchTerm, $options: "i" } }; 
    }
    if (cateId) {
      searchQuery.category = cateId;  
    }
    if (isSelling !== null) {
      searchQuery.isSelling = isSelling;
    }

    const products = await Product.find(searchQuery)
      .populate("category", "_id name")
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};
const getTop10ProductSales = async () => {
  try {
    const searchQuery = {};

    const bills = await Bill.find(searchQuery)
      .populate("lineItem")
      .sort({ createdAt: -1 });

    const productStats = {};
    bills.forEach((bill) => {
      bill.lineItem.forEach((item) => {
        const productId = item.product.toString();
        const quantity = item.quantity;

        if (productStats[productId]) {
          productStats[productId] += quantity;
        } else {
          productStats[productId] = quantity;
        }
      });
    });

    const productIds = Object.keys(productStats);
    const products = await Product.find({ _id: { $in: productIds } });
    const productSale = products.map((product) => {
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        picture: product.picture,
        quantity: productStats[product._id.toString()]
      };
    });

    productSale.sort((a, b) => b.quantity - a.quantity);
    const top10ProductSale = productSale.slice(0, 10);

    return top10ProductSale;
    
  } catch (error) {
    throw new Error(error.message);
  }
};



export const productService = {
  getTop10ProductSales, createNew,  getList, updateNew, getProductsByCategory, unblockProduct, deleteProduct, getById,searchProductByName,getListPage, hardDeleteProduct
};
