import { NlpManager } from 'node-nlp';
import ChatMessage from '../models/chatMessage.js';
import mongoose from 'mongoose';
import { SessionsClient } from 'dialogflow';
import dotenv from 'dotenv';

dotenv.config();

const nlpManager = new NlpManager({ languages: ['vi'], forceNER: true });

nlpManager.addDocument('vi', 'Xin chào', 'greeting');
nlpManager.addDocument('vi', 'Chào bạn', 'greeting');
nlpManager.addDocument('vi', 'Đơn hàng của tôi đâu', 'order_status');
nlpManager.addDocument('vi', 'Kiểm tra đơn hàng', 'order_status');
nlpManager.addDocument('vi', 'Có khuyến mãi gì không', 'promotion');
nlpManager.addAnswer('vi', 'greeting', 'Chào bạn! Tôi là chatbot hỗ trợ. Bạn cần giúp gì?');
nlpManager.addAnswer('vi', 'order_status', 'Vui lòng cung cấp mã đơn hàng để tôi kiểm tra.');
nlpManager.addAnswer('vi', 'promotion', 'Hiện tại có khuyến mãi 20% cho combo gà rán. Bạn muốn đặt ngay?');

const trainNLP = async () => {
  console.log('Training NLP model...');
  await nlpManager.train();
  nlpManager.save();
  console.log('NLP model trained and saved.');
};

trainNLP().catch((err) => console.error('NLP training error:', err));
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Khởi tạo Dialogflow client
const dialogflowClient = new SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const callDialogflow = async (message, sessionId) => {
  try {
    console.log('Calling Dialogflow for message:', message, 'with sessionId:', sessionId);
    // Sử dụng project ID mới
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
    // console.log('NLP response:', nlpResponse);

    if (nlpResponse.intent !== 'None' && nlpResponse.score > 0.7) {
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