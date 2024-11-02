import Optional from "../models/Optional";
import Choice from "../models/choice";
const createNew = async (reqBody) => {
  try {
    const newOptional = new Optional(reqBody);
    const savedOptional = await newOptional.save();
    return savedOptional;
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const optional = await Optional.findById(id).populate("choices");
    if (!optional) {
      throw new Error("Không tìm thấy tùy chọn");
    }
    return optional;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getList = async () => {
  try {
    const optionals = await Optional.find({}).populate("choices"); 
    return optionals;
  } catch (error) {
    throw error;
  }
};

const updateNew = async (id, reqBody) => {
  try {
    const updatedOptional = await Optional.findByIdAndUpdate(id, reqBody, {
      new: true,
    }).populate("choices"); 
    if (!updatedOptional) {
      throw new Error("Không tìm thấy tùy chọn.");
    }
    return updatedOptional;
  } catch (error) {
    throw error;
  }
};

const deleteOptional = async (id) => {
  try {
    const deletedOptional = await Optional.findByIdAndDelete(id);
    if (!deletedOptional) {
      throw new Error("Không tìm thấy tùy chọn để xóa.");
    }
    return deletedOptional;
  } catch (error) {
    throw new Error(error.message);
  }
};

// // Giả sử chúng ta muốn tính tổng chi phí của các lựa chọn trong Optional nếu có (ví dụ dựa trên giá của mỗi choice)
// const getTotalCostOfChoices = async (optionalId) => {
//   try {
//     const optional = await Optional.findById(optionalId).populate("choices");
//     if (!optional) {
//       throw new Error("Không tìm thấy tùy chọn.");
//     }

//     const totalCost = optional.choices.reduce((acc, choice) => acc + (choice.price || 0), 0);
//     return { optionalId, totalCost };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const optionalService = {
  createNew,
  getList,
  updateNew,
  getById,
  deleteOptional,
};
