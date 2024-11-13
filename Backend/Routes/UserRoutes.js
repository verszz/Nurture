const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userController = require("../repositories/Repository.user.js");

// Test route to confirm /api routes are working
router.get('/test', (req, res) => {
    res.send("User routes are working!");
});

// Route for user signup
router.post(
    "/signup",
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    userController.signup
);
router.post(
    "/login",
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    userController.login
)

module.exports = router;
