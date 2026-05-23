require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('BREVO_USER:', process.env.BREVO_USER);
console.log('BREVO_PASS:', process.env.BREVO_PASS ? '✅ Found' : '❌ Missing');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

async function test() {
  try {
    await transporter.sendMail({
      from: process.env.BREVO_USER,
      to: 'gudashisoham@gmail.com',
      subject: 'Test Brevo — Soham Travel',
      text: 'Brevo email is working! 🎉'
    });
    console.log('✅ Email sent successfully!');
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

test();