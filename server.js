const express = require('express');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: '.env'});
require('./config/db')
const app = express();

/*----- BODY PARSER -----*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));


/*----- ROUTES -----*/
app.use('/api/v1/user', userRoutes);

/*----- SERVER -----*/
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})