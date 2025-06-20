require('dotenv').config();
const PayOS = require('@payos/node');

async function testPayOS() {
  console.log('=== TESTING PAYOS CONFIGURATION ===');
  
  // Check environment variables
  console.log('PAYOS_CLIENT_ID:', process.env.PAYOS_CLIENT_ID ? 'Set' : 'Missing');
  console.log('PAYOS_API_KEY:', process.env.PAYOS_API_KEY ? 'Set' : 'Missing');
  console.log('PAYOS_CHECKSUM_KEY:', process.env.PAYOS_CHECKSUM_KEY ? 'Set' : 'Missing');
  
  console.log('\n🔍 Actual values:');
  console.log('CLIENT_ID:', process.env.PAYOS_CLIENT_ID);
  console.log('API_KEY length:', process.env.PAYOS_API_KEY?.length);
  console.log('CHECKSUM_KEY length:', process.env.PAYOS_CHECKSUM_KEY?.length);
  
  if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY || !process.env.PAYOS_CHECKSUM_KEY) {
    console.log('❌ PayOS credentials not complete');
    return false;
  }
  
  // Initialize PayOS
  try {
    const payOS = new PayOS(
      process.env.PAYOS_CLIENT_ID.trim(),
      process.env.PAYOS_API_KEY.trim(),
      process.env.PAYOS_CHECKSUM_KEY.trim()
    );
    
    console.log('✅ PayOS instance created successfully');
    
    // Test payment creation với format đúng theo npm docs
    const testOrderCode = Math.floor(Date.now() / 1000);
    const testPaymentData = {
      orderCode: testOrderCode,
      amount: 10000, // 10,000 VND
      description: "Test payment",
      items: [
        {
          name: "Test Course",
          quantity: 1,
          price: 10000
        }
      ],
      returnUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel",
      buyerName: "Test User",
      buyerEmail: "test@example.com",
      buyerPhone: "0123456789",
      buyerAddress: "Vietnam",
      expiredAt: Math.floor((Date.now() + 15 * 60 * 1000) / 1000) // 15 phút
    };
    
    console.log('\n📋 Test payment data:');
    console.log(JSON.stringify(testPaymentData, null, 2));
    
    console.log('\n🔄 Creating payment link...');
    const result = await payOS.createPaymentLink(testPaymentData);
    
    console.log('\n✅ PayOS test successful!');
    console.log('Payment Link ID:', result.paymentLinkId);
    console.log('Checkout URL:', result.checkoutUrl);
    console.log('QR Code:', result.qrCode);
    
    return true;
    
  } catch (error) {
    console.log('\n❌ PayOS test failed:');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Error details:', error);
    
    // Phân tích lỗi
    if (error.message?.includes('signature')) {
      console.log('\n🔍 Analysis: Signature error - Check CHECKSUM_KEY');
    } else if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
      console.log('\n🔍 Analysis: Authentication error - Check CLIENT_ID và API_KEY');
    } else if (error.message?.includes('orderCode')) {
      console.log('\n🔍 Analysis: Order code error - Check format');
    }
    
    return false;
  }
}

// Chạy test
testPayOS().then(success => {
  console.log('\n=== TEST COMPLETED ===');
  if (success) {
    console.log('🎉 PayOS hoạt động bình thường! Có thể tạo QR code thật.');
  } else {
    console.log('⚠️  PayOS không hoạt động. Sẽ dùng mock payment.');
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 