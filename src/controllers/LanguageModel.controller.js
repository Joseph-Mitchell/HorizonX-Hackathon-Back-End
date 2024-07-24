export default class LanguageModelController {
    #llmService;
    #accountService;
    
    constructor(llmService, accountService) {
        this.#llmService = llmService;
        this.#accountService = accountService;
    }
    
    async getList(req, res) {
        try {
            const response = await this.#llmService.getList();
            
            if (response.length === 0) {
                return res.status(404).json({ message: "No results to display" });
            }
            
            return res.status(200).json({ models: response });
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
    
    async getModel(req, res) {
        try {
            const response = await this.#llmService.getModelById(req.params.id);
            
            if (response === null) {
                return res.status(404).json({ message: "No model with this id was found" });
            }
            
            return res.status(200).json({ model: response });
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
    
    async deleteModel(req, res) {
        try {
            const accountResponse = await this.#accountService.getAccountRoleById(req.body.id);
            if (accountResponse === null)
                return res.status(401).json({ message: "User was not found" });
            if (!accountResponse.role || !accountResponse.role.admin_permissions) {
                return res.status(403).json({ message: "User is not authorized" });
            }
            
            const modelResponse = await this.#llmService.deleteModelById(req.params.id);
            
            if (modelResponse === null) {
                return res.status(404).json({ message: "No model with this id was found" });
            }
            
            return res.status(204).json();
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
    
    async createModel(req, res) {
        try {
            const accountResponse = await this.#accountService.getAccountRoleById(req.body.id);
            if (accountResponse === null)
                return res.status(401).json({ message: "User was not found" });
            if (!accountResponse.role || !accountResponse.role.admin_permissions) 
                return res.status(403).json({ message: "User is not authorized" });
            
            const modelResponse = await this.#llmService.createModel(
                req.body.name,
                req.body.organization,
                req.body.description,
                req.body.date_created,
                req.body.url,
                req.body.datasheet_url,
                req.body.modality,
                req.body.model_analysis,
                req.body.size,
                req.body.dependencies,
                req.body.quality_control,
                req.body.access,
                req.body.license,
                req.body.intended_uses,
                req.body.prohibited_uses,
                req.body.monitoring,
                req.body.feedback,
            );
            if (modelResponse === null) 
                return res.status(400).json({ message: "Model could not be created with the given parameters" });
            
            return res.status(201).json({ model: modelResponse });
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
    
    async editModel(req, res) {
        try {
            const accountResponse = await this.#accountService.getAccountRoleById(req.body.id);
            if (accountResponse === null)
                return res.status(401).json({ message: "User was not found" });
            
            if (!accountResponse.role || !accountResponse.role.admin_permissions) 
                return res.status(403).json({ message: "User is not authorized" });
            
            const existingModelResponse = await this.#llmService.getModelById(req.params.id);
            if (existingModelResponse === null)
                return res.status(404).json({ message: "Model with given id could not be found" });
            
            const modelResponse = await this.#llmService.editModel(
                req.params.id,
                req.body.name,
                req.body.organization,
                req.body.description,
                req.body.date_created,
                req.body.url,
                req.body.datasheet_url,
                req.body.modality,
                req.body.model_analysis,
                req.body.size,
                req.body.dependencies,
                req.body.quality_control,
                req.body.access,
                req.body.license,
                req.body.intended_uses,
                req.body.prohibited_uses,
                req.body.monitoring,
                req.body.feedback,
            );
            if (modelResponse === null) 
                return res.status(400).json({ message: "Model could not be edited with the given parameters" });
            
            return res.status(204).json();
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
}