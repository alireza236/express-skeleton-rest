import { body, matchedData, validationResult} from "express-validator";
const registerValidationRules = () => {
  return [
    // username must be an email
    body('firstname').not().isEmpty().withMessage("Firstname Required"),

    body('lastname').not().isEmpty().withMessage("Lastname Required"),
    
    body('email').isEmail().withMessage("email incorrect"),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }).withMessage("password min 5 character"),
  ]
}

const registerValidate =  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
}

module.exports = {
  registerValidationRules,
  registerValidate,
}
