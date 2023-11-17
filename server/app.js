const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan("dev"))
app.use(cors());

//test functionality of the app server
app.get('/', async (req, res, next) => {
    res.send('Hello Express')
});



app.use(express.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);

const authRouter = require('./auth');
app.use('/auth', authRouter);

module.exports = app;