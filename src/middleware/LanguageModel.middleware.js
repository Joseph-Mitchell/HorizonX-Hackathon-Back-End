import * as expressValidator from "express-validator";

export default class LanguageModelMiddleware {
    static validateModelDetails = () => {
        try {
            return [
                expressValidator
                    .body("name")
                    .notEmpty()
                    .withMessage("Model name must not be empty"),
                expressValidator
                    .body("organization")
                    .notEmpty()
                    .withMessage("Model organization must not be empty"),
                expressValidator
                    .body("date_created")
                    .toDate()
                    .isISO8601()
                    .withMessage("Model date created must be a valid date"),
                expressValidator
                    .body("url")
                    .optional()
                    .notEmpty()
                    .withMessage("Model url must not be empty if given")
                    .isURL()
                    .withMessage("Model url must be a valid url if given"),
                expressValidator
                    .body("datasheet_url")
                    .optional()
                    .notEmpty()
                    .withMessage("Model datasheet url must not be empty if given")
                    .isURL()
                    .withMessage("Model datasheet url must be a valid url if given"),
                expressValidator
                    .body("modality")
                    .notEmpty()
                    .withMessage("Model modality must not be empty"),
                expressValidator
                    .body("dependencies.*.name")
                    .notEmpty()
                    .withMessage("Model dependency names must not be empty"),
                expressValidator
                    .body("dependencies.*.url")
                    .optional()
                    .notEmpty()
                    .withMessage("Model dependency urls must not be empty if given")
                    .isURL()
                    .withMessage("Model dependency urls must be a valid url if given"),
                expressValidator
                    .body("access")
                    .trim()
                    .matches(/^(?:open|closed|limited)$/)
                    .withMessage("Model access must be one of: open, closed, limited"),
                LanguageModelMiddleware.handleValidationErrors,
            ];
        } catch (e) {
            console.log(e);
            return [];
        }
    }
    
    static handleValidationErrors = (req, res, next) => {
        const errors = expressValidator.validationResult(req);       

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    };
}