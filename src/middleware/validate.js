const zod = require("zod");

const validate = (schemas = {}) => (req, res, next) => {
    try {
        if (schemas.body) {
            Object.defineProperty(req, "body", {
                value: schemas.body.parse(req.body),
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
        if (schemas.params) {
            Object.defineProperty(req, "params", {
                value: schemas.params.parse(req.params),
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
        if (schemas.query) {
            Object.defineProperty(req, "query", {
                value: schemas.query.parse(req.query),
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
        next();
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join(".") || "body",
                    message: issue.message
                }))
            });
        }
        return next(error);
    }
};

module.exports = validate;
