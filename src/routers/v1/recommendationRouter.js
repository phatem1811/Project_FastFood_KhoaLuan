import express from "express";

const Router = express.Router();
const recommendationController = require('../../controller/recommendationController');
import { relatedProductsController } from "../../controller/relatedProductsController";
import { authenticate } from "../../middleware/authenticate";


Router.get('/recommendations', authenticate, recommendationController.getRecommendations);
Router.get('/products/related/:id', relatedProductsController.getRelatedProducts);
//module.exports = Router;

export const recommendationRouter = Router;