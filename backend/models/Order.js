const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderCode: {
    type: String,
    required: true,
    unique: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  // Backward compatibility
  amount: {
    type: Number,
    get: function() {
      return this.totalAmount;
    }
  },
  description: {
    type: String
  },
  items: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['PAYOS', 'BANK_TRANSFER', 'MOMO', 'VNPAY'],
    default: 'PAYOS'
  },
  paymentLinkId: {
    type: String
  },
  paymentUrl: {
    type: String
  },
  payosData: {
    bin: String,
    accountNumber: String,
    accountName: String,
    transactionDateTime: Date,
    reference: String
  },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 phút
  },
  paidAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Index để tự động xóa order hết hạn
orderSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ orderCode: 1 });

// Method để kiểm tra order còn hiệu lực
orderSchema.methods.isValid = function() {
  return this.status === 'PENDING' && new Date() < this.expiredAt;
};

// Method để đánh dấu order đã thanh toán
orderSchema.methods.markAsPaid = function(paymentData) {
  this.status = 'PAID';
  this.paidAt = new Date();
  if (paymentData) {
    this.payosData = paymentData;
  }
  return this.save();
};

// Method để hủy order
orderSchema.methods.cancel = function() {
  this.status = 'CANCELLED';
  this.cancelledAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema); 