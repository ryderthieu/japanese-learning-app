const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Tạo payment link
router.post('/create', authenticateJWT, paymentController.createPayment);

// Kiểm tra trạng thái thanh toán
router.get('/status/:orderId', authenticateJWT, paymentController.checkPaymentStatus);

// Webhook từ PayOS (không cần auth)
router.post('/webhook', paymentController.handleWebhook);

// Lấy lịch sử đơn hàng
router.get('/history', authenticateJWT, paymentController.getOrderHistory);

// Hủy đơn hàng
router.delete('/cancel/:orderId', authenticateJWT, paymentController.cancelOrder);

// Mock payment endpoint để test QR code
router.get('/mock-payment', async (req, res) => {
  try {
    const { orderCode, amount, orderId } = req.query;
    
    // Tạo trang HTML đơn giản để simulate payment
    const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mock Payment - Japanese Learning App</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: white;
            }
            .payment-card {
                background: white;
                color: #333;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                text-align: center;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #F472B6;
                margin-bottom: 20px;
            }
            .amount {
                font-size: 36px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            .order-info {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                margin: 10px;
                transition: all 0.3s;
            }
            .btn:hover {
                background: #45a049;
                transform: translateY(-2px);
            }
            .btn.cancel {
                background: #f44336;
            }
            .btn.cancel:hover {
                background: #da190b;
            }
            .status {
                margin: 20px 0;
                padding: 10px;
                border-radius: 10px;
            }
            .status.pending {
                background: #fff3cd;
                color: #856404;
            }
            .status.success {
                background: #d4edda;
                color: #155724;
            }
        </style>
    </head>
    <body>
        <div class="payment-card">
            <div class="logo">🎌 Japanese Learning App</div>
            <h2>Mock Payment Test</h2>
            
            <div class="status pending" id="status">
                ⏳ Đang xử lý thanh toán...
            </div>
            
            <div class="amount">${parseInt(amount).toLocaleString('vi-VN')} VNĐ</div>
            
            <div class="order-info">
                <strong>Mã đơn hàng:</strong> ${orderCode}<br>
                <strong>Order ID:</strong> ${orderId}<br>
                <strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}
            </div>
            
            <p>🔔 Đây là thanh toán TEST. Hãy chọn kết quả:</p>
            
            <button class="btn" onclick="simulatePayment('success')">
                ✅ Thanh toán thành công
            </button>
            
            <button class="btn cancel" onclick="simulatePayment('cancel')">
                ❌ Hủy thanh toán
            </button>
        </div>
        
        <script>
            function simulatePayment(result) {
                const statusDiv = document.getElementById('status');
                
                if (result === 'success') {
                    statusDiv.className = 'status success';
                    statusDiv.innerHTML = '✅ Thanh toán thành công! Đang chuyển hướng...';
                    
                    // Simulate payment success
                    setTimeout(() => {
                        // Redirect về app hoặc success page
                        window.location.href = 'japaneselearningapp://payment/success?orderCode=${orderCode}&status=PAID';
                    }, 2000);
                } else {
                    statusDiv.className = 'status pending';
                    statusDiv.innerHTML = '❌ Đã hủy thanh toán! Đang chuyển hướng...';
                    
                    setTimeout(() => {
                        window.location.href = 'japaneselearningapp://payment/cancel?orderCode=${orderCode}&status=CANCELLED';
                    }, 2000);
                }
            }
            
            // Auto redirect sau 30 giây nếu không có action
            setTimeout(() => {
                alert('Hết thời gian! Tự động hủy thanh toán.');
                simulatePayment('cancel');
            }, 30000);
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi mock payment',
      error: error.message
    });
  }
});

module.exports = router; 