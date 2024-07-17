import { Schema, model } from "mongoose";

const languageModelSchema = new Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String, required: true },
    date_created: { type: Date, required: true },
    url: { type: String, required: true },
});

const LanguageModel = model("LanguageModel", languageModelSchema);

export default LanguageModel;