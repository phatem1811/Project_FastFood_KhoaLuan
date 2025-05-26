import express from 'express';
import { chatbotController } from '../../controller/chatbotController';
import { authenticate } from '../../middleware/authenticate';

const Router = express.Router();

const optionalAuthenticate = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

Router.post('/message', optionalAuthenticate, chatbotController.sendMessage);
Router.get('/history', optionalAuthenticate, chatbotController.getChatHistory);
Router.post('/sync-guest-messages', authenticate, chatbotController.syncGuestMessages);

export const chatMessageRouter = Router;