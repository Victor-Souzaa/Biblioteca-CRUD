const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/acervo', require('./routes/acervoRoutes'));

module.exports = app;
