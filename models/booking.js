const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  firstName:   { type: String },
  lastName:    { type: String },
  email:       { type: String },
  phone:       { type: String },
  destination: { type: String },
  travellers:  { type: String },
  travelDate:  { type: String },
  budget:      { type: String },
  notes:       { type: String },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);