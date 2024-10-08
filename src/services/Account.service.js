import Account from "../models/Account.model.js";

export default class AccountService {
    async getAccountByUsername(username) {
        return await Account.findOne({ username: username });
    }
    
    async getAccountById(id) {
        return await Account.findById(id);
    }
    
    async getAccountRoleById(id) {
        return await Account.findById(id).select("role").populate("role", "admin_permissions")
    }
}