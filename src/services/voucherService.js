import Voucher from "../models/voucher";

const createNew = async (reqBody) => {
  try {
   
    const newVoucher= new Voucher(reqBody);
    const voucher = await newVoucher.save();
    return voucher;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const vouchers = await Voucher.find({});
    return vouchers;
  } catch (error) {
    throw error;
  }
};

const getCode = async (code) => {
  try {

    const voucher = await Voucher.findOne({ code: code });

    if (!voucher) {
      throw new Error("Không tìm thấy voucher với mã này.");
    }

    return voucher;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (id) => {
  try {
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      throw new Error("Không tìm thấy voucher");
    }
    return voucher;
  } catch (error) {
    throw new Error(error.message);
  }
};


const updateNew = async (id, reqBody) => {
    try {
      const updateVoucher = await Voucher.findByIdAndUpdate(id, reqBody, { new: true });
      if (!updateVoucher) {
        throw new Error("Không tìm thấy Voucher.");
      }
      return updateVoucher;
    } catch (error) {
      throw error;
    }
  };

const deleteVoucher = async (id) => {
  try {
    const updated = await Voucher.findByIdAndUpdate(
      id,
      { isActive: false }, 
      { new: true }
    );

    if (!updated) {
      throw new Error("Không tìm thấy tài khoản.");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};

// const unblockVoucher = async (id) => {
//   try {
//     const updated = await Voucher.findByIdAndUpdate(
//       id,
//       { isActive: true }, 
//       { new: true }
//     );

//     if (!updated) {
//       throw new Error("Không tìm thấy voucher.");
//     }

//     return updated;
//   } catch (error) {
//     throw error;
//   }
// };

export const voucherService = {
  createNew,  getList, updateNew, getById, getCode,deleteVoucher
};
