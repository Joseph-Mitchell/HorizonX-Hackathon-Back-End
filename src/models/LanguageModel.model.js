import { Schema, model } from "mongoose";

const languageModelSchema = new Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String, required: false, default: "none" },
    date_created: { type: Date, required: true },
    url: { type: String, required: false, default: "none" },
    datasheet_url: { type: String, required: false, default: "none" },
    modality: { type: String, required: true },
    model_analysis: { type: String, required: false, default: "unknown" },
    size: { type: String, required: false, default: "unknown" },
    dependencies: [
        {
            name: { type: String, required: true },
            url: { type: String, required: false },
        }
    ],
    quality_control: { type: String, required: false, default: "unknown" },
    access: { type: String, required: true, enum: ["open", "closed", "limited"] },
    license: { type: String, required: false, default: "unknown" },
    intended_uses: { type: String, required: false, default: "unknown" },
    prohibited_uses: { type: String, required: false, default: "unknown" },
    monitoring: { type: String, required: false, default: "unknown" },
    feedback: { type: String, required: false, default: "unknown" },
});

const LanguageModel = model("LanguageModel", languageModelSchema);

export default LanguageModel;