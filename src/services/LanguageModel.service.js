import LanguageModel from "../models/LanguageModel.model.js";

export default class LanguageModelService {
    async getList() {
        return await LanguageModel.find({}).select("name organization date_created modality access description");
    }
    
    async getModelById(id) {
        return await LanguageModel.findById(id);
    }
    
    async deleteModelById(id) {
        return await LanguageModel.findByIdAndDelete(id);
    }
    
    async createModel(name, organization, description, date_created, url, datasheet_url, modality, model_analysis, size, dependencies, quality_control, access, license, intended_uses, prohibited_uses, monitoring, feedback) {
        return await LanguageModel.create({
            name: name,
            organization: organization,
            description: description,
            date_created: date_created,
            url: url,
            datasheet_url: datasheet_url,
            modality: modality,
            model_analysis: model_analysis,
            size: size,
            dependencies: dependencies,
            quality_control: quality_control,
            access: access,
            license: license,
            intended_uses: intended_uses,
            prohibited_uses: prohibited_uses,
            monitoring: monitoring,
            feedback: feedback,
        });
    }
    
    async editModel(id, name, organization, description, date_created, url, datasheet_url, modality, model_analysis, size, dependencies, quality_control, access, license, intended_uses, prohibited_uses, monitoring, feedback) {
        return await LanguageModel.findByIdAndUpdate(id, {
            name: name,
            organization: organization,
            description: description,
            date_created: date_created,
            url: url,
            datasheet_url: datasheet_url,
            modality: modality,
            model_analysis: model_analysis,
            size: size,
            dependencies: dependencies,
            quality_control: quality_control,
            access: access,
            license: license,
            intended_uses: intended_uses,
            prohibited_uses: prohibited_uses,
            monitoring: monitoring,
            feedback: feedback,
        });
    }
}
