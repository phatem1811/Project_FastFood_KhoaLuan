import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { accountService } from "../services/accountService";
const  createNew = async (req, res, next) => {
    try {
        const createAccount = await accountService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createAccount});
    }
    catch (error) { next(error); }
}

export const accountController = {
    createNew
}



// import Account from "../models/account"

// const accountController = {
//     createAccount: async (req, res ) => {
//         try {
//             const newAccount = new Account(req.body);
//             const saveAccount = await newAccount.save();
//             res.status(200).json(saveAccount);

//         }
//         catch (err) {

//             res.status(500).json(err)
//         }

//         // res.status(200).json(req.body)
//     },

// };
// module.exports = accountController;