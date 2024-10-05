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
    return categorys;
  } catch (error) {
    throw error;
  }
};
const updateNew = async (id, reqBody) => {
    try {
      const updateCategory = await Category.findByIdAndUpdate(id, reqBody, { new: true });
      if (!updateCategory) {
        throw new Error("Không tìm thấy tài khoản.");
      }
      return updateCategory;
    } catch (error) {
      throw error;
    }
  };


export const categoryService = {
  createNew,  getList, updateNew,
};
