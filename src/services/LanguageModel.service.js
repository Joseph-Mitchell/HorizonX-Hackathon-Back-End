import LanguageModel from "../models/LanguageModel.model.js";

export default class LanguageModelService {
    async getList() {
        return await LanguageModel.find({}).select("name organization date_created modality access description");
    }
    
    async getModelById(id) {
        return await LanguageModel.findById(id);
    }
}