import Product from "../models/product";
import Category from "../models/category";
const createNew = async (reqBody) => {
  try {
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
    const products = await Product.find({});
    return products;
  } catch (error) {
    throw error;
  }
};
const updateNew = async (id, reqBody) => {
    try {
      const updateNew = await Product.findByIdAndUpdate(id, reqBody, { new: true });
      if (!updateNew) {
        throw new Error("Không tìm thấy sản phẩm.");
        }
      return updateNew;
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

export const productService = {
  createNew,  getList, updateNew, getProductsByCategory
};