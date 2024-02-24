const { validationResult } = require("express-validator");

// middleware for formatting errors from express validator middleware
//(to customzie, see express-validator's documentation)

const handleValdationErrors = (req, _res, next ) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const err = {}
            validationErrors
            .array()
            .forEach(error => err[error.path]= error.msg);

            const errors = Error("Bad request.");
            errors.errors = errors;
            errors.status = 400;
            errors.title = "Bad request."

            next(errors);



        
    }
    next()
}
module.exports = {

    handleValdationErrors
}

