import { Schema, model } from "mongoose";

const roleSchema = new Schema({
    role_name: { type: String, required: true },
    admin_permissions: { type: Boolean, required: true },
});

const Role = model("Role", roleSchema);

export default Role;