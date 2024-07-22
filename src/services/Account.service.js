import Account from "../models/Account.model.js";

export default class AccountService {
    async getAccountByUsername(username) {
        return await Account.find({ username: username });
    }
}