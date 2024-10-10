import Product from "../models/product";
import Category from "../models/category";
const createNew = async (reqBody, imagePath) => {
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
const updateNew = async (id, reqBody, imagePath) => {
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

const getById = async (id) => {
  try {
    const product = await Product.findById(id);
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



export const productService = {
  createNew,  getList, updateNew, getProductsByCategory, unblockProduct, deleteProduct, getById
};
