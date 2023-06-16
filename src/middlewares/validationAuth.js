const express = require("express");
const {body} = require("express-validator");

const passwordRegex = 
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginValidatorUsuario = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("El campo Usuario no puede estar vacío.")
    .escape()
    .isEmail().normalizeEmail(),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("El campo contraseña no puede estar vacio.")
    .isLength({min:8})
    .withMessage("La contraseña debe tener como minimo 8 caracteres.")
    .matches(passwordRegex)
    .custom((value, {req}) => {
        if(value !== req.body.repeatpassword)
throw new Error('Las contraseñas no coinciden')
return value      
    }
    )
];

module.exports = {
    loginValidatorUsuario
}
