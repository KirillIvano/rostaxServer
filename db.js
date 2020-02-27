const mongoose = require('mongoose');
const devConfig = require('./configs/database/dev');
const prodConfig = require('./configs/database/prod');

if (process.env.NODE_ENV==='production'){
    mongoose.connect(prodConfig.uri, prodConfig.options);
} else {
    mongoose.connect(devConfig.uri, devConfig.options);
}

mongoose.connection.on('connected', () => {
    console.log('Database connected');
});

mongoose.connection.on('error', () => {
    console.log('Connection failed');
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected database');
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log('Disconnected with' + msg);
        callback();
    });
};

process.on('SIGINT', () => {
    gracefulShutdown('Process terminated', () => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    gracefulShutdown('Heroku terminated', () => {
        process.exit(0);
    });
});
