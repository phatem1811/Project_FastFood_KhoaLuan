import express from "express";
import { chatbotController } from '../../controller/chatbotController';
import { authenticate } from "../../middleware/authenticate";

const Router = express.Router();

Router.post('/message', authenticate, chatbotController.sendMessage);
Router.get('/history', authenticate, chatbotController.getChatHistory);

export const chatMessageRouter = Router;