require('dotenv').config();
require('module-alias/register');

const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');

require('~/initializers/initDb');
require('~/initializers/initPassport');
const adminRoutes = require('./routes');

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

// app.use(cors({credentials: true, origin: 'http://194.67.113.29:5000'}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, 'static', 'admin')));
app.use('/images', express.static(path.resolve(__dirname, 'images')));

const graphQlRoutes = require('./graph').initializeGraphql();

app.post('/gql', graphQlRoutes);

app.use(adminRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'admin', 'index.html'));
});

const server = http.createServer(app);

server.listen(process.env.PORT || 5000);
