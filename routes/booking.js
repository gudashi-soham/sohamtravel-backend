const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const SibApiV3Sdk = require('@getbrevo/brevo');

// Send confirmation email using Brevo API
async function sendConfirmationEmail(booking) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

  const sendSmtpEmail = {
    to: [{ email: booking.email, name: `${booking.firstName} ${booking.lastName}` }],
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'Soham Travel' },
    subject: '✈️ Your Trip is Confirmed — Soham Travel',
    htmlContent: `
      <div style="font-family:Arial;background:#0b1e3d;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
        <h1 style="color:#c9a84c;text-align:center">✦ SOHAM TRAVEL ✦</h1>
        <h2 style="color:#fff">Dear ${booking.firstName} ${booking.lastName},</h2>
        <p style="color:#8fa8c2;font-size:15px;line-height:1.7">We are delighted to confirm your trip request! 🎉<br>Your tour has been <strong style="color:#c9a84c">fixed and confirmed</strong>.</p>
        <div style="background:#f9f6f0;border-left:4px solid #c9a84c;border-radius:8px;padding:20px;margin:20px 0">
          <h3 style="color:#0b1e3d;margin:0 0 15px">📋 Booking Details</h3>
          <p style="margin:8px 0"><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
          <p style="margin:8px 0"><strong>Email:</strong> ${booking.email}</p>
          <p style="margin:8px 0"><strong>Phone:</strong> ${booking.phone}</p>
          <p style="margin:8px 0"><strong>Destination:</strong> ${booking.destination}</p>
          <p style="margin:8px 0"><strong>Travellers:</strong> ${booking.travellers}</p>
          <p style="margin:8px 0"><strong>Travel Date:</strong> ${booking.travelDate}</p>
          <p style="margin:8px 0"><strong>Budget:</strong> ${booking.budget}</p>
          ${booking.notes ? `<p style="margin:8px 0"><strong>Notes:</strong> ${booking.notes}</p>` : ''}
        </div>
        <p style="color:#8fa8c2">Our consultant will contact you within 24 hours. ✈️</p>
        <div style="text-align:center;padding:20px;background:#0b1e3d;border-radius:8px;margin-top:20px">
          <p style="color:#c9a84c;font-size:16px;margin:0">Thank you for travelling with us!</p>
          <p style="color:#fff;font-size:13px;opacity:0.7">© 2026 Soham Travel · All rights reserved</p>
        </div>
      </div>
    `
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
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

    // Send email separately
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

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;