const express = require('express');
const app = express();
const morganLog = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRoute = require('./api/routes/users/users');

mongoose.connect(`mongodb://admin:${process.env.MONGO_ATLAS_PW}@jiratrainee-shard-00-00-stvuc.mongodb.net:27017,jiratrainee-shard-00-01-stvuc.mongodb.net:27017,jiratrainee-shard-00-02-stvuc.mongodb.net:27017/test?ssl=true&replicaSet=JiraTrainee-shard-0&authSource=admin`)

app.use(morganLog('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/users', usersRoute);

// handle 404 errors
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});


// handle all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;