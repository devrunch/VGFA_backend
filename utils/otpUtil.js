import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendVerification = async(number) => {
    
  client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({to: `${number}`, channel: 'sms'})
      .then( verification => 
          console.log(verification.status)
      ); 
}

export const checkVerification = async(number, code) => {
return new Promise((resolve, reject) => {
  client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({to: `${number}`, code: `${code}`})
      .then(verification_check => {
          resolve(verification_check.status)
      });
})
}

