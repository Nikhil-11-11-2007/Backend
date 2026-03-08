const { body } = require("express-validator")


const registerValidation = [
    body("username")
        .trim()
        .isString()
        .notEmpty()
        .withMessage("Username is required"),

    body("email")
        .trim()
        .isString()
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .trim()
        .isString()
        .isLength({ min: 6 })
        .withMessage("Password must be al least 6 characters")
]

const loginValidation = [

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    body()
        .custom((value, { req }) => {
            if (!req.body.email && !req.body.username) {
                throw new Error("Email or Username is required")
            }

            return true
        })
]

module.exports = { registerValidation, loginValidation }