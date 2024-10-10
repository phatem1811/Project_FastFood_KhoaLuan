const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  discountPercent: {
    type: Number,
    required: true
  },
  expDate: {
    type: Date,
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

// Tạo model từ schema
const Event = mongoose.model('Event', EventSchema);

module.exports = Event;