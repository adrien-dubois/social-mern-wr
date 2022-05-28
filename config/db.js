const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to White Rabbit Database'))
    .catch((err) => console.log('Failed to connect to White Rabbit Database', err));