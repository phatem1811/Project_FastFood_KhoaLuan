import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
const  createNew = async (req, res, next) => {
    try {

        res.status(StatusCodes.CREATED).json({message:"Create succesfull"})
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