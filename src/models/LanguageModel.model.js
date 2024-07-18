import { Schema, model } from "mongoose";

const languageModelSchema = new Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String, required: false },
    date_created: { type: Date, required: true },
    url: { type: String, required: false },
    modality: { type: String, required: false },
    model_analysis: { type: String, required: false },
    dependencies: { type: String, required: false },
    quality_control: { type: String, required: false },
    model_analysis: { type: String, required: false },
    size: { type: String, required: false, default: "not known" },
    access: { type: String, required: true, enum: ["open", "closed", "limited"] },
    license: { type: String, required: false, default: "not known" },
    intended_uses: { type: String, required: false, default: "not known" },
    prohibited_uses: { type: String, required: false, default: "not known" },
    monitoring: { type: String, required: false, default: "not known" },
    feedback: { type: String, required: false, default: "not known" },
});

const LanguageModel = model("LanguageModel", languageModelSchema);

export default LanguageModel;