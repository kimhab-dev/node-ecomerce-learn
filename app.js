const express = require('express');
// const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const product = require('./routes/product');
const category = require('./routes/category')

const app = express();
app.use(express.json());

// app.use(cookieParser);


app.use('/api/auth', auth);
app.use(product);
app.use(category);

const port = process.env.PORT
app.listen(port, () => {
    console.log("server running on port " + port);
})