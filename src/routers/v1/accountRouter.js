import express from 'express';
import { StatusCodes } from 'http-status-codes';
// import accountController from '../../controller/accountController';

import {accountValidation} from '../../validations/accountValidation';
import {accountController} from '../../controller/accountController';

const Router = express.Router();

Router.route("/")
    .get((req, res) =>{
        res.status(StatusCodes.OK).json({message : "Get list account"})
    })
    .post(accountValidation.createAccount, accountController.createNew)

    
Router.route("/login")
    .post(accountController.login);    

// Router.post("/",  accountController.createAccount );

export const accountRoute = Router;