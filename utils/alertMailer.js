const Brevo = require('@getbrevo/brevo');
require("dotenv").config(); // Environment variables ke liye

// Function ka naam wahi hai -> sendAlert
const sendAlert = async (subject, text) => {
  try {
    // Brevo ka logic yahan hai
    const apiInstance = new Brevo.TransactionalEmailsApi();

    // Sahi API Key set karne ka tareeka
    apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY // .env file se Brevo API key aayegi
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Email ki details set karein
    sendSmtpEmail.subject = subject; // Function se aaya hua subject
    sendSmtpEmail.sender = { "name": "Sensor Alert System", "email": "yashmalviya476@gmail.com" }; // Aapka verified sender email
    sendSmtpEmail.to = [{ "email": "malviyayash793@gmail.com" }]; // Receiver email fixed hai
    
    // HTML content ko behtar banayein
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; border: 1px solid #dcdcdc; padding: 20px; border-radius: 5px;">
            <h2 style="color: #c0392b;">🚨 Sensor Alert! 🚨</h2>
            <p style="font-size: 16px;"><strong>Alert Type:</strong> ${subject}</p>
            <p style="font-size: 16px;"><strong>Details:</strong> ${text}</p>
            <hr>
            <p style="font-size: 12px; color: #7f8c8d;">This is an automated message from your sensor monitoring system. Please do not reply.</p>
        </div>
    `;

    // Email bhejein
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Alert Mail Sent Successfully using Brevo.");

  } catch (error) {
    console.error("❌ Brevo API Mail Sending Error:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

// sendAlert function ko export karein
module.exports = sendAlert;

