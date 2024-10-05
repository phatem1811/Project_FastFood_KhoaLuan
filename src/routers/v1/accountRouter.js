import express from 'express';
import { StatusCodes } from 'http-status-codes';
// import accountController from '../../controller/accountController';

import {accountValidation} from '../../validations/accountValidation';
import {accountController} from '../../controller/accountController';

const Router = express.Router();

Router.route("/list")
    .get( accountController.getList)

Router.route("/create")    
    .post(accountValidation.createAccount, accountController.createNew)

Router.route("/:id")
    .put(accountValidation.updateAccount, accountController.updateAccount);

    
Router.route("/login")
    .post(accountController.login);    

// Router.post("/",  accountController.createAccount );

export const accountRoute = Router;