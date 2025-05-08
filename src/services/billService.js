const mongoose = require("mongoose");
import OrderNotification from "../models/OrderNotification"; 
import Lineitem from "../models/lineitem";
import Bill from "../models/bill";
import Account from "../models/account";
import Product from "../models/product";
import { socketServer } from "../socketserver";
const createNew = async (billData) => {
  const session = await mongoose.startSession();
  let newBill;
  try {
    await session.withTransaction(async () => {
      const lineItems = await Promise.all(
        billData.lineItems.map(async (item) => {
          const filteredOptions = (item.options || []).filter(
            (option) => option.optionId && option.choiceId
          );

          const newLineItem = new Lineitem({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.subtotal,
            options: filteredOptions.map((option) => ({
              option: option.optionId,
              choices: option.choiceId,
              addPrice: option.addPrice || 0,
            })),
          });

          await newLineItem.save({ session });
          return newLineItem._id;
        })
      );
      newBill = new Bill({
        ship: billData.ship,
        fullName: billData.fullName,
        total_price: billData.total_price,
        address_shipment: billData.address_shipment,
        phone_shipment: billData.phone_shipment,
        isPaid: billData.isPaid,
        lineItem: lineItems,
        pointDiscount: billData.pointDiscount || 0,
        voucher: billData.voucher || null,
        note: billData.note || null,
        account: billData.account || null,
      });
      await newBill.save({ session });

      if (billData.account) {
        const account = await Account.findById(billData.account).session(
          session
        );
        if (!account) {
          throw new Error("Account not found");
        }

        const pointsToAdd = Math.floor(newBill.total_price / 100);
        const pointDiscount = billData.pointDiscount || 0;
        if (account.point < pointDiscount) {
          throw new Error("Not enough points for discount");
        }

        const newPoint = account.point - pointDiscount + pointsToAdd;
        await Account.findByIdAndUpdate(
          billData.account,
          {
            $push: { bills: newBill._id },
            point: newPoint,
          },
          { session, new: true }
        );
      }
    });

    session.endSession();
    return newBill;
  } catch (error) {
    session.endSession();
    throw error;
  }
};


const getList = async (
  page = 1,
  limit = 10,
  phone_shipment = null,
  accountId = null,
  state = null
) => {
  try {
    const skip = (page - 1) * limit;
    let searchQuery = {};
    if (phone_shipment) {
      searchQuery = {
        phone_shipment: { $regex: phone_shipment, $options: "i" },
      };
    }
    if (accountId !== null) {
      searchQuery.account = accountId;
    }

    if (state !== null) {
      searchQuery.state = state;
    }
    const bills = await Bill.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate("lineItem")
      .sort({ createdAt: -1 });
    const totalBill = await Bill.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBill / limit);
    return {
      bills,
      pagination: {
        currentPage: page,
        totalPages,
        totalBill,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createBillSocket = async (billData) => {
  const session = await mongoose.startSession();
  let newBill;
  try {
    await session.withTransaction(async () => {
      // Tạo các lineItems từ billData
      const lineItems = await Promise.all(
        billData.lineItems.map(async (item) => {
          const filteredOptions = (item.options || []).filter(
            (option) => option.optionId && option.choiceId
          );

          const newLineItem = new Lineitem({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.subtotal,
            options: filteredOptions.map((option) => ({
              option: option.optionId,
              choices: option.choiceId,
              addPrice: option.addPrice || 0,
            })),
          });

          await newLineItem.save({ session });
          return newLineItem._id;
        })
      );

      newBill = new Bill({
        ship: billData.ship,
        fullName: billData.fullName,
        total_price: billData.total_price,
        address_shipment: billData.address_shipment,
        phone_shipment: billData.phone_shipment,
        isPaid: billData.isPaid,
        lineItem: lineItems,
        pointDiscount: billData.pointDiscount || 0,
        voucher: billData.voucher || null,
        note: billData.note || null,
        account: billData.account || null,
      });

      await newBill.save({ session });

      const notify = new OrderNotification({
        billId: newBill._id,
        message: `${billData.fullName} vừa đặt một đơn hàng mới.`,
      });
      await notify.save({ session });

      if (billData.account) {
        const account = await Account.findById(billData.account).session(
          session
        );
        if (!account) {
          throw new Error("Account not found");
        }

        const pointsToAdd = Math.floor(newBill.total_price / 100);
        const pointDiscount = billData.pointDiscount || 0;
        if (account.point < pointDiscount) {
          throw new Error("Not enough points for discount");
        }

        const newPoint = account.point - pointDiscount + pointsToAdd;
        await Account.findByIdAndUpdate(
          billData.account,
          { $push: { bills: newBill._id }, point: newPoint },
          { session, new: true }
        );
      }
    });

    session.endSession();
    return newBill; // Trả về hóa đơn mới tạo
  } catch (error) {
    session.endSession();
    throw error;
  }
};

const updateBill = async (id, state) => {
  try {
    const updateData = state === 4 ? { state, isPaid: true } : { state };
    const updatedBill = await Bill.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBill) {
      throw new Error("Bill không tồn tại");
    }

    return updatedBill;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const updateBillSocket = async (id, state) => {
  try {
    const updateData = state === 4 ? { state, isPaid: true } : { state };
    const updatedBill = await Bill.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedBill) {
      throw new Error("Bill không tồn tại");
    }

    return updatedBill;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getListByDate = async () => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const searchQuery = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const bills = await Bill.find(searchQuery)
      .populate("lineItem")
      .sort({ createdAt: -1 });

    const productStats = {};
    bills.forEach((bill) => {
      bill.lineItem.forEach((item) => {
        const productId = item.product.toString();
        const quantity = item.quantity;
        if (productStats[productId]) {
          productStats[productId] += quantity;
        } else {
          productStats[productId] = quantity;
        }
      });
    });
    const productIds = Object.keys(productStats);
    const products = await Product.find({ _id: { $in: productIds } });

    const productSale = products.map((product) => {
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        picture: product.picture,
        quantity: productStats[product._id.toString()],
      };
    });

    productSale.sort((a, b) => b.quantity - a.quantity);

    return {
      productSale,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (id) => {
  try {
    const bill = await Bill.findById(id).populate([
      {
        path: "lineItem",
        populate: [
          { path: "product" },
          { path: "options.option" },
          { path: "options.choices" },
        ],
      },
      { path: "voucher" }, 
    ]);

    if (!bill) {
      throw new Error("Không tìm thấy hóa đơn");
    }

    return bill;
  } catch (error) {
    throw new Error(error.message);
  }
};



const getMonthlyRevenue = async (year, productId = null) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  if (!productId) {

    const monthlyRevenue = await Bill.aggregate([
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
          totalRevenue: { $sum: "$total_price" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
      const monthRevenue = monthlyRevenue.find((item) => item._id === i + 1);
      return {
        month: i + 1,
        totalRevenue: monthRevenue ? monthRevenue.totalRevenue : 0,
      };
    });

    return revenueByMonth;
  }

  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $lookup: {
        from: "lineitems", 
        localField: "lineItem",
        foreignField: "_id",
        as: "lineItems",
      },
    },
    { $unwind: "$lineItems" },
  ];


  if (productId) {
    pipeline.push({
      $match: {
        "lineItems.product": new mongoose.Types.ObjectId(productId),
      },
    });
  }

  pipeline.push(
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: {
          $sum: "$lineItems.subtotal", 
        },
      },
    },
    { $sort: { _id: 1 } }
  );

  const monthlyRevenue = await Bill.aggregate(pipeline);

  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const monthRevenue = monthlyRevenue.find((item) => item._id === i + 1);
    return {
      month: i + 1,
      totalRevenue: monthRevenue ? monthRevenue.totalRevenue : 0,
    };
  });

  return revenueByMonth;
};

export const billService = {
  createNew,
  getList,
  updateBill,
  getById,
  getListByDate,
  getMonthlyRevenue,
  createBillSocket,
};
