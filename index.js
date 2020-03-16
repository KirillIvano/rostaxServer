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
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, 'static', 'dist')));
app.use(express.static(path.resolve(__dirname, 'static', 'dist', 'image')));
const graphQlRoutes = require('./graph').initializeGraphql();

app.post('/gql', graphQlRoutes);

app.use(adminRoutes);

app.get('/adminPanel(/*|)', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'admin', 'index.html'));
});

const server = http.createServer(app);

server.listen(process.env.PORT || 5000);
