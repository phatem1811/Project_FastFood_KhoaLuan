import { StatusCodes } from "http-status-codes";
import Event from "../models/event";
import Product from "../models/product";
require("dotenv").config();
const createNew = async (reqBody) => {
  try {
    const createNew = new Event(reqBody);
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
    const products = Array.isArray(reqBody.products) ? reqBody.products : [];
    const isActive = reqBody.isActive;

    // 1. Lấy event hiện tại và danh sách sản phẩm cũ
    const currentEvent = await Event.findById(id);
    if (!currentEvent) {
      throw new Error("Không tìm thấy sự kiện.");
    }

    const oldProducts = await Product.find({ event: id }).select("_id");

    // 2. Kiểm tra discount có thay đổi không
    const isDiscountChanged =
      reqBody.discountPercent !== currentEvent.discountPercent;

    // 3. Chuẩn bị dữ liệu để update Event
    let updateData = { ...reqBody };
    if (isActive === false) {
      updateData.products = [];
    }

    // 4. Cập nhật Event
    const updated = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    //  Nếu event bị vô hiệu hóa -> reset toàn bộ sản phẩm liên quan
    if (isActive === false) {
      await Product.updateMany({ event: id }, [
        {
          $set: {
            event: null,
            currentPrice: "$price",
          },
        },
      ]);
    }

    const oldIds = oldProducts.map((p) => p._id.toString());
    const newIds = products.map((id) => id.toString());

    const isProductListChanged =
      oldIds.length !== newIds.length ||
      !oldIds.every((id) => newIds.includes(id));

    if (isProductListChanged) {
      const removedProducts = oldProducts.filter(
        (product) => !newIds.includes(product._id.toString())
      );
      if (removedProducts.length > 0) {
        await Product.updateMany(
          { _id: { $in: removedProducts.map((p) => p._id) } },
          [
            {
              $set: {
                event: null,
                currentPrice: "$price",
              },
            },
          ]
        );
      }
    }

    // Gán sự kiện và tính giá giảm cho sản phẩm mới
    if (products.length > 0) {
      const discountPercent = updated.discountPercent;
      await Promise.all(
        products.map(async (productId) => {
          const product = await Product.findById(productId);
          if (product) {
            const discount = (product.price * discountPercent) / 100;
            const newCurrentPrice = product.price - discount;
            await Product.findByIdAndUpdate(productId, {
              $set: { event: updated._id, currentPrice: newCurrentPrice },
            });
          }
        })
      );
    }

    //  Nếu discount thay đổi, cập nhật lại giá cho tất cả sản phẩm thuộc event mới
    if (isDiscountChanged) {
      const affectedProducts = await Product.find({ event: updated._id });
      const newDiscount = updated.discountPercent;

      await Promise.all(
        affectedProducts.map(async (product) => {
          const discount = (product.price * newDiscount) / 100;
          const newCurrentPrice = product.price - discount;
          await Product.findByIdAndUpdate(product._id, {
            $set: { currentPrice: newCurrentPrice },
          });
        })
      );
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

const hardDeleteEvent = async (id) => {
  try {
    // Tìm và xóa sự kiện
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      throw new Error("Không tìm thấy sự kiện.");
    }

    await Product.updateMany({ event: id }, [
      {
        $set: {
          event: null,
          currentPrice: "$price",
        },
      },
    ]);

    return {
      message: "Sự kiện đã được xóa thành công.",
      event,
    };
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
  hardDeleteEvent,
};
