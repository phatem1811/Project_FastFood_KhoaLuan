import Category from "../models/category";

const createNew = async (reqBody) => {
  try {
    const newCategory= new Category(reqBody);
    const saveCategory = await newCategory.save();
    return saveCategory;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const categorys = await Category.find({});
    // const categoryWithProducts = await Category.findById('6700ee83457472976c88ee92').populate('products');
    return categorys;
  } catch (error) {
    throw error;
  }
};
const updateNew = async (id, reqBody) => {
    try {
      const updateCategory = await Category.findByIdAndUpdate(id, reqBody, { new: true });
      if (!updateCategory) {
        throw new Error("Không tìm thấy category.");
      }
      return updateCategory;
    } catch (error) {
      throw error;
    }
  };

const deleteCategory = async (id) => {
  try {
    const updatedCate = await Category.findByIdAndUpdate(
      id,
      { isActive: false }, 
      { new: true }
    );

    if (!updatedCate) {
      throw new Error("Không tìm thấy tài khoản.");
    }

    return updatedCate;
  } catch (error) {
    throw error;
  }
};

const unblockCategory = async (id) => {
  try {
    const updatedCate = await Category.findByIdAndUpdate(
      id,
      { isActive: true }, 
      { new: true }
    );

    if (!updatedCate) {
      throw new Error("Không tìm thấy danh mục.");
    }

    return updatedCate;
  } catch (error) {
    throw error;
  }
};

export const categoryService = {
  createNew,  getList, updateNew, deleteCategory, unblockCategory
};
