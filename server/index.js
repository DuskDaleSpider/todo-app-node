const express = require('express');
const volleyball = require('volleyball');

//bring in the .env
require('dotenv').config();

const app = express();
const auth = require('./api/auth/');
const authorization = require('./middleware/authorization.js'); 

app.use(volleyball);

app.use(express.json());

app.get('/', (req, res, next) => {
    res.json({message: 'this is a test with vim'});
});

app.use('/api/auth', auth);

app.get('/test', (req, res, next) =>{
    const error = new Error('This is a test error'); 
    next(error);
});

app.get('/auth-test', authorization, (req, res, next) => {
    res.json({message: 'Authroization Successful', user: req.user});
});

const notFound = (req, res, next) => {
    res.status(404);
    res.json({message: "Not Found"});
};

const error = (err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({error: err.message, stack: err.stack});
};

app.use(notFound);
app.use(error);

app.listen(5000, () => {
    console.log("listening on 5000");
});
