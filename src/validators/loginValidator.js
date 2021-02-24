import { body, matchedData, validationResult} from "express-validator";
const loginValidationRules = () => {
  return [
   
    body('email').not().isEmpty().withMessage(" Email Required"),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }).withMessage("Password min 5 character"),
  ]
}

const loginValidate =  (req, res, next) => {
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
  loginValidationRules,
  loginValidate,
}
