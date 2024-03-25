const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
dotenv.config();
const logger = require('./services/logger');

//models
const authRoutes = require('./routes/authRoutes');




app.use(bodyParser.json());
//security for all routes
app.use(cors());
app.use(morgan('dev'));



app.use("/auth",authRoutes);


logger.warn("hi")
//DB connection 
mongoose.connect(process.env.DATABASE_URI).then(()=>{
    console.log('DB is connected')
}).catch((err)=>{
    console.log('DB connection error:',err)
})


app.listen(process.env.PORT,()=>{
    console.log(`App is running on ${process.env.PORT}`)  
});

