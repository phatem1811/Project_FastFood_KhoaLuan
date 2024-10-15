const mongoose = require("mongoose");

import Lineitem from "../models/lineitem";
import Bill from "../models/bill";
import Account from "../models/account";
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
      fullName:  billData.fullName,
      total_price: billData.total_price,
      address_shipment: billData.address_shipment,
      phone_shipment: billData.phone_shipment,
      isPaid: billData.isPaid,
      lineItem: lineItems, 
      voucher: billData.voucher || null, 
      note: billData.note || null, 
      account: billData.account || null, 
    });

    await newBill.save({ session }); 

    await Account.findByIdAndUpdate(
        billData.account, 
        { $push: { bills: newBill._id } },
        { session } 
      );

    await session.commitTransaction(); 
    session.endSession();

    return newBill; 
  } catch (error) {
    await session.abortTransaction(); 
    session.endSession(); 
    throw error; 
  }
}
const getList = async () => {
    try {

      const bills = await Bill.find(filter)
        .populate('lineItem') 
        .populate('account') 
        .sort({ createdAt: -1 }) 

  
      return bills;
    } catch (error) {
      throw new Error("Không thể lấy danh sách hóa đơn: " + error.message);
    }
  };

export const billService = {
    createNew, getList
  };
  
