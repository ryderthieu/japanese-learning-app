const PayOS = require('@payos/node');

// PayOS configuration
const CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const API_KEY = process.env.PAYOS_API_KEY;
const CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

// Validate environment variables
if (!CLIENT_ID || !API_KEY || !CHECKSUM_KEY) {
  console.error('❌ PayOS configuration incomplete. Please check environment variables.');
  module.exports = null;
} else {
  try {
    // Initialize PayOS with correct constructor format
    const payOS = new PayOS(
      CLIENT_ID.trim(),
      API_KEY.trim(),  
      CHECKSUM_KEY.trim()
    );

    console.log('✅ PayOS initialized successfully');
    module.exports = payOS;
  } catch (error) {
    console.error('❌ Failed to initialize PayOS:', error.message);
    module.exports = null;
  }
} 