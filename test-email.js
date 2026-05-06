require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Found' : '❌ Not found');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'sohamgudashi@gmail.com',
      subject: 'Test — Soham Travel',
      text: 'Email is working! 🎉'
    });
    console.log('✅ SUCCESS! Email sent!');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }
}

sendTest();