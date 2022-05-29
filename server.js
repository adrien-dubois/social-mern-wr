const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: '.env'});
require('./config/db')
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();

/*----- MIDDLEWARE -----*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

/*----- JWT CHECK -----*/
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
})

/*----- ROUTES -----*/
app.use('/api/v1/user', userRoutes);

/*----- SERVER -----*/
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})