const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const configMongo = require('./config/mongo');
const userRouter = require('./router/userRouter');
const cors = require('cors')

// dot env config
dotenv.config({path : './config/config.env'})

// app uses
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.json());
app.use(cors())

// routers
app.use('/api/v1',userRouter)

// PORT
const PORT = process.env.PORT || 8080
// server
app.listen(PORT,() => {
    console.log(`http://localhost:${PORT}`);

    // Mongo Server
    configMongo();
})