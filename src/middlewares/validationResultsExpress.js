const {validationResult} = require("express-validator");

const validationResultsExpress = (req, res, next) => {
   // console.log(req);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.render('register', {
        exist_error: true,
        error: 'Error en los campos'
      });
      //  return res.status(400).json({errors: errors.array()});
    }
    return next();
};

module.exports = {validationResultsExpress};