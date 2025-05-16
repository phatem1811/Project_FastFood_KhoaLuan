import Optional from "../models/optional";
import Choice from "../models/choice";
import Product from "../models/product";
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

    const optionalToDelete = await Optional.findById(id);
    if (!optionalToDelete) {
      throw new Error("Không tìm thấy tùy chọn để xóa.");
    }

    await Choice.deleteMany({ _id: { $in: optionalToDelete.choices } });
    await Product.updateMany(
      { options: id }, 
      { $pull: { options: id } } 
    );

    const deletedOptional = await Optional.findByIdAndDelete(id);
    return deletedOptional;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const optionalService = {
  createNew,
  getList,
  updateNew,
  getById,
  deleteOptional,
};
