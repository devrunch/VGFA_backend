import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendVerification = async (number) => {
    try {

        const data = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to: `${number}`, channel: 'sms' })
        return data;
    }
    catch (err) {
        console.log(err)
    }
}

export const checkVerification = async (number, code) => {
    try {
        const data = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: `${number}`, code: `${code}` })
        return data.status === 'approved';
    }
    catch (error) {
        if(error.status === 404){
            let err = new Error("OTP expired, please resend OTP");
            err.status = 404;
            throw err;
        }
        else{
            throw error;
        }

    }
}

