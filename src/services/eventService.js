import { StatusCodes } from "http-status-codes";
import Event from '../models/event';

require("dotenv").config();
const createNew = async (reqBody) => {
  try {
    const createNew= new Event(reqBody);
    const save = await createNew.save();
    return save;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const list = await Event.find({});
    return list;
  } catch (error) {
    throw error;
  }
};
const updateNew = async (id, reqBody) => {
  try {
    const updated = await Event.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    if (!updated) {
      throw new Error("Không tìm thấy sự kiện.");
    }
    return updated;
  } catch (error) {
    throw error;
  }
};
// const unblockEvent = async (id) => {
//   try {
//     const updatedAccount = await Account.findByIdAndUpdate(
//       id,
//       { state: true }, 
//       { new: true }
//     );

//     if (!updatedAccount) {
//       throw new Error("Không tìm thấy tài khoản.");
//     }

//     return updatedAccount;
//   } catch (error) {
//     throw error;
//   }
// };

const deleteEvent = async (id) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      id,
      { isActive: false }, 
      { new: true }
    );

    if (!updated) {
      throw new Error("Không tìm thấy sự kiện.");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};






const getById = async (id) => {
  try {
    const event = await Event.findById(id);
    if (!event) {
      throw new Error("Không tìm thấy sự kiện");
    }
    return event;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const eventService = {
  createNew,
  getList,
  updateNew,
  getById,
  deleteEvent,
};
