const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    userEmail : {
        type : String,
        require : true
    },
    mobileNo : {
        type : Number,
        require : true
    },
    vehicleNo : {
        type : Number,
        require : true
    }
})

const qrCodeSchema = new mongoose.Schema({
    email : {
        type : String,
        require : true
    },
    qrCodeImage : {
        type : String,
        require : true
    }
})

const UserModel = new mongoose.model("UserData" , userSchema)
const QrCodeModel = new mongoose.model("UserQrCode", qrCodeSchema)

module.exports = {UserModel,QrCodeModel}