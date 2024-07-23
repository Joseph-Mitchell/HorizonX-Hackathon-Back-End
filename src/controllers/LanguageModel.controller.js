export default class LanguageModelController {
    #llmService;
    
    constructor(llmService) {
        this.#llmService = llmService;
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
            const response = await this.#llmService.deleteModelById(req.params.id);
            
            if (response === null) {
                return res.status(404).json({ message: "No model with this id was found" });
            }
            
            return res.status(204);
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
}