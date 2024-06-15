const express = require('express');
const app = express();
const indexRouter = require("./Routes/index");
const db = require("./Config/Connection");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');

// Set up bodyParser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up CORS middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
};
app.use(cors(corsOptions));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static('static'))
// Set up routes 
app.use('/', indexRouter);

db.connect()
    .then(() => {
        app.listen(3001, () => {
            console.log(`Server started at Port No: ${3001}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
