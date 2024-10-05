import express from 'express';
import { accountRoute } from './accountRouter';
import { categoryRoute } from './categoryRouter';

const Router = express.Router();

Router.get('/status', (req, res) => {
    res.status(200).json({ message : 'API has already'});
})

Router.use('/account', accountRoute);
Router.use('/category', categoryRoute);

export const APIs = Router;