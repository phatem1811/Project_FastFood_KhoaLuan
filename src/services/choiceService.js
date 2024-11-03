import Choice from "../models/choice";
import Optional from "../models/Optional";

const createNew = async (reqBody) => {

  try {
    const newChoice = new Choice(reqBody);
    const savedChoice = await newChoice.save();

    if (reqBody.optional) {
      await Optional.findByIdAndUpdate(
        reqBody.optional,
        { $push: { choices: savedChoice._id } }, 
        { new: true }
      );
    }

    return savedChoice;
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const choice = await Choice.findById(id);
    if (!choice) {
      throw new Error("Không tìm thấy lựa chọn");
    }
    return choice;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getList = async () => {
  try {
    const choices = await Choice.find({});
    return choices;
  } catch (error) {
    throw error;
  }
};

const updateNew = async (id, reqBody) => {
  try {
    const updatedChoice = await Choice.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    if (!updatedChoice) {
      throw new Error("Không tìm thấy lựa chọn.");
    }
    return updatedChoice;
  } catch (error) {
    throw error;
  }
};

const deleteChoice = async (id) => {
  try {
    const deletedChoice = await Choice.findByIdAndDelete(id);
    if (!deletedChoice) {
      throw new Error("Không tìm thấy lựa chọn để xóa.");
    }


    await Optional.updateMany(
      { choices: id }, 
      { $pull: { choices: id } } 
    );

    return deletedChoice;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getChoicesByOptionalId = async (optionalId) => {
  try {
    const optional = await Optional.findById(optionalId).populate("choices");
    if (!optional) {
      throw new Error("Không tìm thấy tùy chọn.");
    }
    return optional.choices;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const choiceService = {
  createNew,
  getList,
  updateNew,
  getById,
  deleteChoice,
  getChoicesByOptionalId,
};
