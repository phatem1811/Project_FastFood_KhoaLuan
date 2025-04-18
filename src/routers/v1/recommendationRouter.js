import express from "express";

const Router = express.Router();
import { relatedProductsController } from "../../controller/relatedProductsController";
import { authenticate } from "../../middleware/authenticate";
import { recommendationController } from '../../controller/recommendationController';


Router.get('/recommendations', authenticate, recommendationController.getRecommendations);
Router.get('/products/related/:id', relatedProductsController.getRelatedProducts);
//module.exports = Router;

export const recommendationRouter = Router;