
let gnrateOtp = Math.floor(1000 + Math.random() * 9000);


const ganrateOTP = () => {
    return gnrateOtp;
}


const verifyToken = (yourOtp) => {
    if(yourOtp === gnrateOtp){
        return true
    }else{
        return false
    }
}


module.exports = {ganrateOTP,verifyToken}