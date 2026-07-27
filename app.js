require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DBConnect = require('./src/config/dbconnect');

DBConnect();



const app = express();

const Port = process.env.PORT || 3008;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));



const authRouter = require('./src/router/api/authroute');
app.use('/api', authRouter);

const productroute = require('./src/router/api/product.api');
app.use('/api', productroute);


app.listen(Port, () => {
    console.log(`Server is running on port: ${Port}`);
});
