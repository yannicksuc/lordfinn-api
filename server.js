const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the CORS middleware

const errorHandler = require('./middleware/errorHandler');
const eventRoutes = require('./routes/events');
const occurrenceRoutes = require('./routes/occurrences');
const uploadRoutes = require('./routes/upload');

const app = express();
const port = 3000;

app.use(cors());  // Use CORS middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files

// Use the routes
app.use('/events', eventRoutes);
app.use('/occurrences', occurrenceRoutes);
app.use('/upload', uploadRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
