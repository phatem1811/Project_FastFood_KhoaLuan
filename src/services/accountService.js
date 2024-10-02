import Account from "../models/account"

const createNew = async (reqBody) => {
    try {
        const newAccount = new Account(reqBody);
        const saveAccount = await newAccount.save();
        return saveAccount ;  
    }
    catch (error) { throw error; }
}

export const accountService = {
    createNew
}

