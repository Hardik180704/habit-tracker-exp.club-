import brevo from '@getbrevo/brevo';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    // @ts-ignore - Accessing protected property as per Brevo docs
    this.apiKey = this.apiInstance.authentications['apiKey'];
    this.apiKey.apiKey = process.env.BREVO_API_KEY;
    console.log('Brevo Service Initialized. API Key length:', this.apiKey.apiKey ? this.apiKey.apiKey.length : 0);
  }

  async sendEmail({ to, subject, templateName, data }) {
    if (!process.env.BREVO_API_KEY) {
      console.warn('⚠️ BREVO_API_KEY is missing. Email not sent.');
      return;
    }

    try {
      // Correct path to views/emails relative to services/
      const templatePath = path.join(__dirname, '../views/emails', `${templateName}.ejs`);
      
      const htmlContent = await ejs.renderFile(templatePath, data);

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = { name: "Onyx Habit Tracker", email: process.env.SENDER_EMAIL || "noreply@onyx.com" };
      sendSmtpEmail.to = [{ email: to }];

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`📧 Email sent to ${to}. Message ID: ${response.body.messageId}`);
      return response;
    } catch (error) {
      console.error('Email sending failed:', error);
      // Don't throw for welcome emails to prevent blocking registration
      if (templateName !== 'welcome') {
        throw error; 
      }
    }
  }
}

export const emailService = new EmailService();
