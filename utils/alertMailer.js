const Brevo = require('@getbrevo/brevo');
require("dotenv").config();

// Ab function mein 'email' lene ki zaroorat nahi hai
const mailSender = async (title, body) => {
  try {
    // TransactionalEmailsApi ka ek naya instance banayein
    const apiInstance = new Brevo.TransactionalEmailsApi();

    // .setApiKey() method ka istemal karein
    apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey, 
        process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Email ki details set karein
    sendSmtpEmail.subject = title;
    sendSmtpEmail.htmlContent = body;
    sendSmtpEmail.sender = { "name": "Blog App", "email": "yashmalviya476@gmail.com" };
    
    // --- YAHAN BADLAV KIYA GAYA HAI ---
    // Receiver ka email address ab fixed hai
    sendSmtpEmail.to = [{ "email": "malviyayash793@gmail.com" }];

    // Email bhejein
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("Mail Sent Successfully using Brevo API:", data);
    return data;

  } catch (error) {
    console.error(" Brevo API Mail Sending Error:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = mailSender;
