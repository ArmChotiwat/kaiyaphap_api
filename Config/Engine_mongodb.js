const MongoDB_URI = process.env.MONGODB_URI || require('./cfg_mongodb');

const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(MongoDB_URI);

const mongooseConn = mongoose.createConnection(
    MongoDB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
    }
);



module.exports = { mongoose, mongooseConn };