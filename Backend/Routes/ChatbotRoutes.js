const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Send message to Python API
        const response = await axios.post('http://127.0.0.1:5000/predict', { message });
        const botResponse = response.data.response;

        // Send response back to the frontend
        res.json({ response: botResponse });
    } catch (error) {
        res.status(500).json({ error: "Error communicating with the Python API" });
    }
});

module.exports = router;