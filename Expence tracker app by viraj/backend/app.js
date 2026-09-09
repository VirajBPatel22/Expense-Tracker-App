const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./db/db');
const { readdirSync } = require('fs');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// Routes
const routesPath = path.join(__dirname, 'routes');
readdirSync(routesPath).map((route) => app.use('/api/v1', require(path.join(routesPath, route))));

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('listening to port :', PORT);
    });
};
server();