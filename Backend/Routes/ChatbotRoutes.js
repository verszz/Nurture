const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("Received request:", req.body); // Debug log
    const { message } = req.body;

    if (!message || message.trim() === "") {
        return res.json({ response: "Hello! How can I assist you today?" });
    }

    const payload = {
        messages: [
            { role: "user", content: message.trim() },
            { role: "assistant", content: "Please avoid mentioning any names in the response." }
        ]
    };

    try {
        const response = await axios.post('http://127.0.0.1:8000/v1/chat/completions', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        const botResponse = response.data.choices[0]?.message?.content || "No response from AI.";
        res.json({ response: botResponse });
    } catch (error) {
        console.error("Error communicating with the AI:", error.message);
        res.status(500).json({ error: "Error communicating with the AI" });
    }
});

module.exports = router;
