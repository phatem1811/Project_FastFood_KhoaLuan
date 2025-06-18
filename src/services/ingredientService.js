import Ingredient from "../models/ingredient";

const createNew = async (reqBody) => {
  try {
    const newingredient = new Ingredient(reqBody);
    const saveingredient = await newingredient.save();
    return saveingredient;
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      throw new Error("Không tìm thấy nguyên liệu");
    }
    return ingredient;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getList = async () => {
  try {
    const ingredient = await Ingredient.find({});

    return ingredient;
  } catch (error) {
    throw error;
  }
};
const updateNew = async (id, reqBody) => {
  try {
    const updateingredient = await Ingredient.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    if (!updateingredient) {
      throw new Error("Không tìm thấy nguyên liêu.");
    }
    return updateingredient;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const deletedIngredient = await Ingredient.findByIdAndDelete(id);
    if (!deletedIngredient) {
      throw new Error("Không tìm thấy nguyên liệu để xóa.");
    }
    return deletedIngredient;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMonthlyExpenses = async (year) => {
  try {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const monthlyExpenses = await Ingredient.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          totalExpense: { $sum: { $multiply: ["$price", "$quantity"] } }, 
        },
      },
      {
        $sort: { _id: 1 }, 
      },
    ]);
    const expensesByMonth = Array.from({ length: 12 }, (_, i) => {
      const monthExpense = monthlyExpenses.find((item) => item._id === i + 1);
      return {
        month: i + 1, // Tháng từ 1 đến 12
        totalExpense: monthExpense ? monthExpense.totalExpense : 0, 
      };
    });
    console.log("check revenue", expensesByMonth);

    return expensesByMonth;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ingredientService = {
  createNew,
  getList,
  updateNew,
  getById,
  deleteById,
  getMonthlyExpenses,
};
