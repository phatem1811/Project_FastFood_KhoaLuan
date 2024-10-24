const mongoose = require("mongoose");

import Lineitem from "../models/lineitem";
import Bill from "../models/bill";
import Account from "../models/account";
import Product from "../models/product";
const createNew = async (billData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lineItems = await Promise.all(
      billData.lineItems.map(async (item) => {
        const newLineItem = new Lineitem({
          product: item.product,
          quantity: item.quantity,
          subtotal: item.subtotal,
        });

        await newLineItem.save({ session });
        return newLineItem._id;
      })
    );

    const newBill = new Bill({
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
    const pointsToAdd = Math.floor(newBill.total_price / 100);
    const pointDiscount = billData.pointDiscount || 0;
    
    const account = await Account.findById(billData.account).session(session);
    if (!account) {
      throw new Error('Account not found');
    }

    const newPoint = account.point - pointDiscount + pointsToAdd;
    
    if (account.point < pointDiscount) {
      throw new Error('Not enough points for discount');
    }

    await Account.findByIdAndUpdate(
      billData.account,
      {
        $push: { bills: newBill._id }, 
        point: newPoint,
      },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    return newBill;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getList = async (
  page = 1,
  limit = 10,
  phone_shipment = null,
  accountId = null
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

const updateBill = async (id, state) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      { state },
      { new: true }
    );

    if (!updatedBill) {
      throw new Error("Bill không tồn tại");
    }

    return updatedBill;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getListByDate = async (startDate, endDate) => {
  try {

    const searchQuery = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)   
      }
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
    const revenue = bills.reduce((total, bill) => total + bill.total_price, 0);
    return {
      bills,
      revenue,
      productSale
    }; 
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (id) => {
  try {
    const bill = await Bill.findById(id).populate({
      path: "lineItem",
      populate: {
        path: "product", 
      },
    });

    if (!bill) {
      throw new Error("Không tìm thấy danh mục");
    }
    return bill;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getMonthlyRevenue = async (year) => {
  try {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

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
          _id: { $month: "$createdAt" }, // Nhóm theo tháng
          totalRevenue: { $sum: "$total_price" }, // Tính tổng doanh thu của tháng
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo thứ tự tháng từ 1 đến 12
      },
    ]);

    // Đảm bảo trả về doanh thu cho tất cả 12 tháng, nếu tháng nào không có doanh thu thì giá trị sẽ là 0
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
      const monthRevenue = monthlyRevenue.find((item) => item._id === i + 1);
      return {
        month: i + 1, // Tháng (1 đến 12)
        totalRevenue: monthRevenue ? monthRevenue.totalRevenue : 0, // Doanh thu
      };
    });

    return revenueByMonth;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const billService = {
  createNew,
  getList,
  updateBill,
  getById,
  getListByDate,
  getMonthlyRevenue
};
