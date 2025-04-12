import express from 'express';
import { accountRoute } from './accountRouter';
import { categoryRoute } from './categoryRouter';
import { productRoute } from './productRouter';
import { eventRoute } from './eventRouter';
import { billRoute } from './billRouter';
import { voucherRoute } from './voucherRouter';
import { ingredientRoute } from './ingredientRouter';
import { optionalRoute } from './optionalRouter';
import { choiceRoute } from './choiceRouter';
import { reviewRoute } from './reviewRouter';
import { orderNotifyRoute } from './orderNotifycationRouter';
const Router = express.Router();

Router.get('/status', (req, res) => {
    res.status(200).json({ message : 'API has already'});
})

Router.use('/account', accountRoute);
Router.use('/category', categoryRoute);
Router.use('/product', productRoute);
Router.use('/event', eventRoute);
Router.use('/bill', billRoute);
Router.use('/voucher', voucherRoute);
Router.use('/ingredient', ingredientRoute);
Router.use('/optional', optionalRoute);
Router.use('/choice', choiceRoute);
Router.use('/review', reviewRoute);
Router.use('/order-notify', orderNotifyRoute);

export const APIs = Router;