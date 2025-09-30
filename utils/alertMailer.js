const Brevo = require('@getbrevo/brevo');
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // TransactionalEmailsApi ka ek naya instance banayein
    const apiInstance = new Brevo.TransactionalEmailsApi();
    console.log("Loading Brevo API Key:", process.env.BREVO_API_KEY);

    // .setApiKey() method ka istemal karein
    apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey, 
        process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Email ki details set karein
    sendSmtpEmail.subject = title;
    sendSmtpEmail.htmlContent = body;
    sendSmtpEmail.sender = { "name": "Blog App", "email": "yashmalviya46@gmail.com" };
    
    // --- YAHAN BADLAV KIYA GAYA HAI ---
    // Ab email do logon ko jayega: ek jo function mein pass hua hai aur doosra aapka email.
    sendSmtpEmail.to = [
        { "email": email }, 
        { "email": "malviyayash793@gmail.com" }
    ];

    // Email bhejein
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Mail Sent Successfully using Brevo API:", data);
    return data;

  } catch (error) {
    console.error("❌ Brevo API Mail Sending Error:", error.message);
    // Behtar error details ke liye
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = mailSender;
