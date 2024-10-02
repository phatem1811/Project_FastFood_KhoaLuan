import express from 'express';
import { accountRoute } from './accountRouter';

const Router = express.Router();

Router.get('/status', (req, res) => {
    res.status(200).json({ message : 'API has already'});
})

Router.use('/account', accountRoute);

export const APIs = Router;