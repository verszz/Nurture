const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const journalController = require("../repositories/Repository.journal.js");

// Test route to confirm /api routes are working
router.get('/test', (req, res) => {
    res.send("User routes are working!");
});

// Route for user signup
router.post(
    "/AddJournal",
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('Content').notEmpty().withMessage('Content is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    journalController.addJournal
);
router.post(
    "/getAllJournal",
    [
        body('username').notEmpty().withMessage('Username is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    journalController.getAllJournal
);
router.post(
    "/getSpecificJournal",
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('title').notEmpty().withMessage('Title is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    journalController.getJournalSpecific
)
router.post(
    "/EditJournal",
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('Content').notEmpty().withMessage('Content is required'),
        body('new_title').notEmpty().withMessage('New Title is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    journalController.EditJournalSpecific
);
module.exports = router;
