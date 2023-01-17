const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/exceptionHandler');

require('dotenv/config');

const api = process.env.APP_URL;


//Middleware
app.use(express.json()) //Parsing json content type
app.use(morgan('tiny')) //for logging api logs
app.use(cors());
app.use('*', cors());
app.use(authJwt());
app.use(errorHandler);

const productRouter = require('./routers/product');
const categoryRouter = require('./routers/category');
const userRouter = require('./routers/user');
const orderRouter = require('./routers/order');

//Routes
app.use(`${api}/products`, productRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/order`, orderRouter);
app.get('/', (req, res) => res.send('eShop Marketplace'));

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_DB_CRED).then(() => {
    console.log('DB connection estisblished');
}).catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server is listening at http://localhost:3000');
});