import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const sendVerification = async ( contactNumber) => {
    try {
        
        await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to: `${contactNumber}`, channel: 'sms' })
            .then(verification =>
                console.log(verification)
            );
    } catch (error) {
        console.log(error);
    }
};

const checkVerification = async(number, code) => {
    return new Promise((resolve, reject) => {
        client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({to: `${number}`, code: `${code}`})
            .then(verification_check => {
                resolve(verification_check.status)
            });
    })
}
// sendVerification( "+916387817791" )
console.log(checkVerification("+916387817791",'532720').then((res) => console.log(res)) ) 