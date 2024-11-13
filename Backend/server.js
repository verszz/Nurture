require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const userRoutes = require('./Routes/UserRoutes.js');
const journalRoutes = require('./Routes/JournalRoutes.js');
const ScheduleRoutes = require('./Routes/ScheduleRoutes.js');
const NewsRoutes = require('./Routes/NewsRoutes.js');
const ChatbotRoutes = require('./Routes/ChatbotRoutes.js');
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the user routes
app.use('/user', userRoutes);
app.use('/journal', journalRoutes);
app.use('/schedule',ScheduleRoutes);
app.use('/news',NewsRoutes);
app.use('/chatbot',ChatbotRoutes);
 
// Define the port using the environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
