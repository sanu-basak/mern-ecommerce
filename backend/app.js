const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

const api = process.env.APP_URL;


//Middleware
app.use(express.json()) //Parsing json content type
app.use(morgan('tiny')) //for logging api logs
app.use(cors());
app.use('*',cors());

const productRouter = require('./routers/product');
const categoryRouter = require('./routers/category');

//Routes
app.use(`${api}/products`, productRouter);
app.use(`${api}/category`,categoryRouter);

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_DB_CRED).then(() => {
    console.log('DB connection estisblished');
}).catch((err) => {
    console.log(err);
});

app.listen(3000,() => {
    console.log('Server is listening at http://localhost:3000');
});