import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    
});

const Account = model("Account", accountSchema);

export default Account;