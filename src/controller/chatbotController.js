import { NlpManager } from 'node-nlp';
import ChatMessage from '../models/chatMessage.js';
import mongoose from 'mongoose';
import { SessionsClient } from 'dialogflow';
import dotenv from 'dotenv';
import bill from '../models/bill.js';

dotenv.config();

const nlpManager = new NlpManager({ languages: ['vi'], forceNER: true });

// Intent: Greeting
nlpManager.addDocument('vi', 'Xin chào', 'greeting');
nlpManager.addDocument('vi', 'Chào bạn', 'greeting');
nlpManager.addAnswer('vi', 'greeting', 'Chào bạn! Tôi là FastFoodBot, rất vui được giúp bạn hôm nay. Bạn cần gì nào?');

// Intent: Menu
nlpManager.addDocument('vi', 'Thực đơn có gì?', 'menu');
nlpManager.addDocument('vi', 'Menu hôm nay có gì?', 'menu');
nlpManager.addAnswer('vi', 'menu', 'Thực đơn hôm nay có gà rán, bánh mì, khoai tây chiên, và các loại nước uống như Pepsi, trà chanh. Bạn muốn gọi món nào?');

// Intent: Order Status
nlpManager.addDocument('vi', 'Kiểm tra đơn hàng', 'order_status');
nlpManager.addDocument('vi', 'Đơn hàng của tôi đâu', 'order_status');
nlpManager.addAnswer('vi', 'order_status', 'Vui lòng cung cấp mã đơn hàng để tôi kiểm tra.');

// Intent: Promotion
nlpManager.addDocument('vi', 'Có khuyến mãi gì không', 'promotion');
nlpManager.addAnswer('vi', 'promotion', 'Hiện tại có khuyến mãi 20% cho combo gà rán. Bạn muốn đặt ngay?');

const trainNLP = async () => {
  console.log('Training NLP model...');
  await nlpManager.train();
  nlpManager.save();
  console.log('NLP model trained and saved.');
};

trainNLP().catch((err) => console.error('NLP training error:', err));
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const dialogflowClient = new SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const callDialogflow = async (message, sessionId) => {
  try {
    console.log('Calling Dialogflow for message:', message, 'with sessionId:', sessionId);
    const sessionPath = dialogflowClient.sessionPath('newagent-hvwx', sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'vi',
        },
      },
    };
    console.log('Sending request to Dialogflow:', JSON.stringify(request, null, 2));
    const [response] = await dialogflowClient.detectIntent(request);
    const result = response.queryResult;
    console.log('Dialogflow response:', JSON.stringify(result, null, 2));
    const fulfillmentText = result.fulfillmentText || 'Xin lỗi, tôi chưa hiểu. Bạn có thể nói rõ hơn không?';
    console.log('Dialogflow fulfillmentText:', fulfillmentText);
    return fulfillmentText;
  } catch (error) {
    console.error('Dialogflow error:', error.message);
    return 'Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Bạn có thể thử lại không?';
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const accountId = req.user?.id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      const error = new Error('ID tài khoản không hợp lệ');
      error.statusCode = 400;
      throw error;
    }

    const userMessage = await ChatMessage.create({
      account: accountId,
      message,
      sender: 'user',
    });

    let botReply;
    const nlpResponse = await nlpManager.process('vi', message);

    const orderIdMatch = message.match(/mã đơn hàng ([a-fA-F0-9]+)/i) || message.match(/đơn hàng ([a-fA-F0-9]+)/i);
    if (orderIdMatch && orderIdMatch[1]) {
      const orderId = orderIdMatch[1];
      const order = await bill.findOne({ _id: orderId, account: accountId });
      if (order) {
        const statusMap = {
          1: 'Đang xử lý',
          2: 'Đang chuẩn bị',
          3: 'Đang giao hàng',
          4: 'Đã giao',
          5: 'Đã hủy',
        };
        const status = statusMap[order.state] || 'Không xác định';
        botReply = `Đơn hàng ${order._id} của bạn hiện đang ở trạng thái: ${status}. Địa chỉ giao hàng: ${order.address_shipment}. Tổng tiền: ${order.total_price} VNĐ.`;
      } else {
        botReply = `Không tìm thấy đơn hàng với mã ${orderId}. Bạn có chắc mã đơn hàng đúng không?`;
      }
    } else if (nlpResponse.intent !== 'None' && nlpResponse.score > 0.7) {
      botReply = nlpResponse.answer || 'Xin lỗi, tôi chưa hiểu. Bạn có thể nói rõ hơn không?';
      console.log('Using node-nlp reply:', botReply);
    } else {
      console.log('Falling back to Dialogflow');
      botReply = await callDialogflow(message, accountId);
    }

    const botMessage = await ChatMessage.create({
      account: accountId,
      message: botReply,
      sender: 'bot',
    });

    const io = req.app.get('socketio');
    if (!io) {
      console.error('Socket.io not initialized');
      throw new Error('Socket.io not initialized');
    }
    io.to(accountId).emit('chat_message', {
      userMessage,
      botMessage,
    });
    console.log('Emitted chat_message to:', accountId);

    res.status(200).json({
      message: 'Gửi tin nhắn thành công',
      data: { userMessage, botMessage },
    });
  } catch (error) {
    console.error('Send message error:', error);
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const accountId = req.user?.id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      const error = new Error('ID tài khoản không hợp lệ');
      error.statusCode = 400;
      throw error;
    }

    const messages = await ChatMessage.find({ account: accountId })
      .sort({ timestamp: 1 })
      .lean();

    res.status(200).json({
      message: 'Lấy lịch sử chat thành công',
      messages,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    next(error);
  }
};

export const chatbotController = {
  sendMessage,
  getChatHistory,
};