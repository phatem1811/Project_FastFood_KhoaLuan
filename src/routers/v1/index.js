import express from 'express';
import { accountRoute } from './accountRouter';
import { categoryRoute } from './categoryRouter';
import { productRoute } from './productRouter';

const Router = express.Router();

Router.get('/status', (req, res) => {
    res.status(200).json({ message : 'API has already'});
})

Router.use('/account', accountRoute);
Router.use('/category', categoryRoute);
Router.use('/product', productRoute);

export const APIs = Router;