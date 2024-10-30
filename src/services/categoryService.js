import Category from "../models/category";
import Product from "../models/product";

const createNew = async (reqBody) => {
  try {
    const newCategory= new Category(reqBody);
    const saveCategory = await newCategory.save();
    return saveCategory;
  } catch (error) {
    throw error;
  }
};

// const getList = async () => {
//   try {
//     const categorys = await Category.find({});
//     // const categoryWithProducts = await Category.findById('6700ee83457472976c88ee92').populate('products');
//     return categorys;
//   } catch (error) {
//     throw error;
//   }
// };

const getById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};


const getList = async () => {
  try {

    const categoriesWithProducts = await Category.find({})
      .populate('products') 
      .exec(); 

    return categoriesWithProducts;
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

      if (reqBody.isActive === false) {
        await Category.findByIdAndUpdate(id, { products: [] }, { new: true });
        await Product.updateMany(
          { category: id },
          { $set: { category: null } }
        );
      return updateCategory;
      }
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


const harddeleteCategory = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Không tìm thấy danh mục.");
    }

    await Category.findByIdAndDelete(id);

    await Product.updateMany(
      { category: id },
      { $set: { category: null } }
    );

    return { message: "Danh mục đã được xóa thành công." };
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
  createNew,  getList, updateNew, deleteCategory, unblockCategory, getById, harddeleteCategory
};
