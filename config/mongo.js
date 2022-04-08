const mongoose = require('mongoose');

const configMongo = () => {
    mongoose.connect(process.env.MONGO_URI).then((server) => {
        console.log(`Mongo Server is Host No : ${server.connection.host}`);
    }).catch((error) =>{
        console.log(`Something Went Wrong : ${error}`);
    })
}

module.exports = configMongo