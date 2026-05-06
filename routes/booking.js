const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/Booking');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send confirmation email function
async function sendConfirmationEmail(booking) {
  const mailOptions = {
    from: `"Soham Travel" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: '✈️ Your Trip is Confirmed — Soham Travel',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0b1e3d, #1a3a6b); padding: 40px 30px; text-align: center; }
          .header h1 { color: #c9a84c; font-size: 28px; margin: 0; letter-spacing: 2px; }
          .header p { color: #ffffff; margin: 8px 0 0; font-size: 14px; opacity: 0.8; }
          .body { padding: 40px 30px; }
          .greeting { font-size: 22px; color: #0b1e3d; font-weight: bold; margin-bottom: 10px; }
          .message { color: #555; font-size: 15px; line-height: 1.7; margin-bottom: 25px; }
          .booking-card { background: #f9f6f0; border-left: 4px solid #c9a84c; border-radius: 8px; padding: 20px 25px; margin-bottom: 25px; }
          .booking-card h3 { color: #0b1e3d; margin: 0 0 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e8e0d0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #888; font-size: 13px; }
          .detail-value { color: #0b1e3d; font-weight: bold; font-size: 13px; }
          .thank-you { text-align: center; padding: 25px; background: #0b1e3d; }
          .thank-you p { color: #c9a84c; font-size: 16px; margin: 0; letter-spacing: 1px; }
          .thank-you span { color: #ffffff; font-size: 13px; display: block; margin-top: 8px; opacity: 0.7; }
          .footer { text-align: center; padding: 20px; color: #aaa; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- Header -->
          <div class="header">
            <h1>✦ SOHAM TRAVEL ✦</h1>
            <p>Your journey begins here</p>
          </div>

          <!-- Body -->
          <div class="body">
            <p class="greeting">Dear ${booking.firstName} ${booking.lastName},</p>
            <p class="message">
              We are absolutely delighted to confirm your trip request! 🎉<br><br>
              Your tour has been <strong>fixed and confirmed</strong>. Our travel consultant will contact you within 24 hours with your complete itinerary and travel details.
            </p>

            <!-- Booking Details Card -->
            <div class="booking-card">
              <h3>📋 Your Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">${booking.firstName} ${booking.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">${booking.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${booking.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Destination</span>
                <span class="detail-value">${booking.destination}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Travellers</span>
                <span class="detail-value">${booking.travellers}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Travel Date</span>
                <span class="detail-value">${booking.travelDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Budget</span>
                <span class="detail-value">${booking.budget}</span>
              </div>
              ${booking.notes ? `
              <div class="detail-row">
                <span class="detail-label">Special Notes</span>
                <span class="detail-value">${booking.notes}</span>
              </div>` : ''}
            </div>

            <p class="message">
              If you have any questions or need to make changes, feel free to reply to this email. We're here to make your journey absolutely perfect! ✈️
            </p>
          </div>

          <!-- Thank You -->
          <div class="thank-you">
            <p>Thank you for travelling with us!</p>
            <span>© 2026 Soham Travel · All rights reserved</span>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>This is an automated confirmation email from Soham Travel.</p>
          </div>

        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Save new booking + send email
router.post('/', async (req, res) => {
  try {
    console.log('📦 Booking received:', req.body);

    const { firstName, lastName, email, phone, destination, travellers, travelDate, budget, notes } = req.body;

    const booking = new Booking({
      firstName, lastName, email,
      phone, destination, travellers,
      travelDate, budget, notes
    });

    await booking.save();
    console.log('✅ Booking saved!');

    // Send email separately so booking still works even if email fails
    try {
      await sendConfirmationEmail(booking);
      console.log('📧 Email sent to:', email);
    } catch (emailErr) {
      console.log('❌ Email Error:', emailErr.message);
    }

    res.status(201).json({ message: 'Booking successful!' });

  } catch (err) {
    console.log('❌ Booking Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;