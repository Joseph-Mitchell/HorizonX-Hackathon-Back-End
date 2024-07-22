import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", default: "669e6af4240de0b241684274" },
});

const Account = model("Account", accountSchema);

export default Account;