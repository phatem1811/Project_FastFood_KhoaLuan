import express from 'express';

import { voucherController } from '../../controller/voucherController';
const Router = express.Router();


Router.route("/list")
    .get( voucherController.getList)

Router.route("/create")    
    .post(voucherController.createNew)

Router.route("/:id")
    .put(voucherController.updateNew);

// // Router.route("/delete/:id")
// //     .put(voucherController.deletevoucher);

// // Router.route("/unblock/:id")
// //     .put(voucherController.unblockvoucher);


Router.route("/get/:id")
    .get(voucherController.getById);

Router.route("/getcode")
    .get(voucherController.getCode);
    


// Router.post("/",  accountController.createAccount );

export const voucherRoute = Router;