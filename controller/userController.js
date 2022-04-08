const asynHandler = require('express-async-handler');
const { UserModel, QrCodeModel } = require('../model/allUserQr');
const nodemailer = require('nodemailer');
const { ganrateOTP, verifyToken } = require('../middleware/otp');
const qr = require('qrcode');

const sendMail = (userEmail,mailSubject,mailMessage) => {
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth : {
            user : process.env.USER_ID,
            pass : process.env.USER_PASSWORD
        }
    })

    const mail_options = {
        from : process.env.USER_ID,
        to : userEmail,
        subject : mailSubject,
        html : mailMessage
    }

    transport.sendMail(mail_options,function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log(`Mail Sent to : ${userEmail}`);
        }
        transport.close();
    })

} 

const userRegister = asynHandler(async (req,res) => {
    const {name,uEmail} = req.body;

    const user = await UserModel.findOne({userEmail : uEmail});

    if(!user){
        const get_html_message = (userName) => {
            return `
                <p>Dear, <b>${userName}</b></p>
                </br>
                <p>Your OTP : ${ganrateOTP()}</p>
                <h2>Thank You</h3>
             `
        }
        // Nodemail
        sendMail(uEmail,"OTP Verification",get_html_message(name));
        // 
        res.status(200).json({
            success : true,
            message : `OTP Send to ${uEmail}`
        })

    }else{
        return res.json({
            success : false,
            message : `user  alredy register`
         })
    }

})

const validateUser = asynHandler(async (req,res) => {
    const {otp} = req.params;
    const {name,uEmail,mNo,vNo} = req.body;
    const isVerify = verifyToken(Number(otp));

    if(isVerify === true){
      

        qr.toDataURL( `http://localhost:3001/ContactOwnerVeh_Mob/${uEmail}`,
        function (err, code) {

            if(err) return console.log("error occurred")

            // create user
             UserModel.create({
                name,
                userEmail : uEmail,
                mobileNo : mNo,
                vehicleNo : vNo
            })

            // genrate qrcode
            QrCodeModel.create({
                email : uEmail,
                qrCodeImage : code
            })

                const get_html_message = (userName) => {
                    return `
                    <p>Dear, <b>${userName}</b></p>
                    </br>
                    <p>Your aacount is Created successfully</p>
                    
                    <h2>Thank You</h3>
                    `
                }
                
                sendMail(uEmail,"User Registration Successfully",get_html_message(name));
        
                res.status(200).json({
                    success :true,
                    message :  `User Register Succefully`,
                    data : {
                        qrcode : code
                    }
                })

        });

    }else{
        return res.status(404).json({
            success : false,
            message : `Wrong OTP`
        })
    }

})


const getUserInfo = asynHandler(async(req,res) => {
    const {email} = req.params

    const user = await UserModel.findOne({userEmail : email});

    if(user){
        const qrcode = await QrCodeModel.findOne({email});

        res.status(200).json({
            success : true,
            data : {user,qrcode : qrcode}
        })
    }else{
        return res.status(401).json({
            success : false,
            message : `user not found`
        })
    }
})

const sendMessage = asynHandler(async(req,res) => {
    const from = req.body.from
    const to = req.body.to
    const message = req.body.message
   

    const user = await UserModel.find({userEmail : to})


    if(user){
        const get_html_message = (from,message) => {
            return `
            
            </br>
            <p>from : ${from}</p>
            <p>message : ${message} </p>
            
            <h2>Thank You</h3>
            `
        }
        
        sendMail(to,"Import Message",get_html_message(from,message));

        res.status(200).json({
            success : true,
            message : `Message Sent ${to}`
        })

    }
})


module.exports = {userRegister,validateUser,getUserInfo,sendMessage}