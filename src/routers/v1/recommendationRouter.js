import express from "express";

const Router = express.Router();
const recommendationController = require('../../controller/recommendationController');
const relatedProductsController = require('../../controller/relatedProductsController');
import { authenticate } from "../../middleware/authenticate";


Router.get('/recommendations', authenticate, recommendationController.getRecommendations);
Router.get('/products/related/:id', relatedProductsController.getRelatedProducts);
//module.exports = Router;

export const recommendationRouter = Router;