import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendVerification = async (number) => {
    const data = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
        .verifications
        .create({ to: `${number}`, channel: 'sms' })
    return data;
}

export const checkVerification = async (number, code) => {
    const data = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
        .verificationChecks
        .create({ to: `${number}`, code: `${code}` })
    console.log(data)
    return data.status === 'approved';
}

