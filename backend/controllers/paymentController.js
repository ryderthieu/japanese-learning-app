const payOS = require('../config/payos');
const Order = require('../models/Order');
const Course = require('../models/course');
const User = require('../models/user');

// Helper function to add user to purchased courses
const enrollUserInCourses = async (userId, orderItems) => {
  try {
    const courseIds = orderItems.map(item => item.courseId);
    
    // Add courses to user's courses (purchased courses)
    await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          courses: { $each: courseIds }
        }
      }
    );

    console.log('✅ User enrolled in courses:', courseIds.length);
    return true;
  } catch (error) {
    console.error('❌ Error enrolling user in courses:', error);
    throw error;
  }
};

// Tạo payment link
const createPayment = async (req, res) => {
  try {
    const { items, returnUrl, cancelUrl } = req.body;
    const userId = req.user._id;

    // Validate input data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and cannot be empty'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Generate unique order code (positive integer)
    const timestamp = Math.floor(Date.now() / 1000);
    const orderCode = `ORDER_${timestamp}_${userId}`;

    // Get course details and calculate total
    const courseIds = items.map(item => item.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });
    
    if (courses.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some courses not found'
      });
    }

    const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);

    // Create order in database
    const order = new Order({
      userId,
      orderCode,
      items: courses.map(course => ({
        courseId: course._id,
        courseName: course.title,
        price: course.price,
        quantity: 1
      })),
      totalAmount,
      status: 'PENDING',
      paymentMethod: 'PAYOS',
      expiredAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });

    await order.save();

    // Create PayOS description (max 25 characters)
    const description = courses.length === 1 
      ? `Khoa hoc ${courses[0].title}`.substring(0, 25)
      : `${courses.length} khoa hoc`;

    // Format payment data for PayOS
    const paymentData = {
      orderCode: parseInt(timestamp), // Positive integer as required
      amount: totalAmount,
      description: description,
      items: courses.map(course => ({
        name: course.title,
        quantity: 1,
        price: course.price
      })),
      returnUrl: returnUrl || 'http://localhost:3000/payment/success',
      cancelUrl: cancelUrl || 'http://localhost:3000/payment/cancel',
      buyerName: req.user.fullName || 'Customer',
      buyerEmail: req.user.email || 'customer@example.com',
      buyerPhone: req.user.phone || '0123456789',
      buyerAddress: req.user.address || 'Vietnam',
      expiredAt: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes from now
    };

    // Create payment link with PayOS
    const paymentLink = await payOS.createPaymentLink(paymentData);

    // Save paymentLinkId to order
    order.paymentLinkId = paymentLink.paymentLinkId;
    order.paymentUrl = paymentLink.checkoutUrl;
    await order.save();

    console.log('✅ Payment created:', {
      orderId: order._id,
      orderCode: order.orderCode,
      paymentLinkId: paymentLink.paymentLinkId
    });

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderCode: order.orderCode,
        paymentUrl: order.paymentUrl,
        qrCode: paymentLink.qrCode,
        amount: totalAmount,
        status: 'PENDING',
        expiredAt: order.expiredAt
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating payment'
    });
  }
};

// Kiểm tra trạng thái thanh toán
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    console.log('✅ Order found:', { 
      orderId, 
      status: order.status, 
      paymentLinkId: order.paymentLinkId,
      orderCode: order.orderCode
    });

    // Nếu đơn hàng vẫn pending, kiểm tra với PayOS
    if (order.status === 'PENDING' && order.paymentLinkId) {
      try {
        // Sử dụng paymentLinkId để check với PayOS
        const paymentInfo = await payOS.getPaymentLinkInformation(order.paymentLinkId);
        
        console.log('📋 PayOS payment info:', paymentInfo);
        
        if (paymentInfo.status === 'PAID') {
          order.status = 'PAID';
          order.paidAt = new Date();
          await order.save();
          console.log('✅ Order status updated to PAID');

          // Add user to purchased courses
          await enrollUserInCourses(userId, order.items);
        }
      } catch (payosError) {
        console.log('⚠️ PayOS check failed:', payosError.message);
        // Fallback: Nếu không check được PayOS, vẫn trả về status hiện tại
      }
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderCode: order.orderCode,
        status: order.status,
        amount: order.totalAmount,
        items: order.items,
        createdAt: order.createdAt,
        expiredAt: order.expiredAt,
        paidAt: order.paidAt
      }
    });

  } catch (error) {
    console.error('❌ Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra trạng thái thanh toán',
      error: error.message
    });
  }
};

// Webhook handler cho PayOS
exports.handleWebhook = async (req, res) => {
  try {
    console.log('=== PAYOS WEBHOOK RECEIVED ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const webhookData = req.body.data || req.body;
    const { orderCode, status, amount, description } = webhookData;

    console.log('🔍 Extracted webhook data:', {
      orderCode,
      status, 
      amount,
      description
    });

    if (!orderCode) {
      console.log('❌ Missing orderCode in webhook');
      return res.status(400).json({
        success: false,
        message: 'Missing orderCode in webhook'
      });
    }

    // Tìm order bằng numeric order code hoặc full orderCode
    let order = await Order.findOne({ 
      $or: [
        { orderCode: { $regex: `_${orderCode}_` } },
        { orderCode: orderCode.toString() }
      ]
    });

    if (!order) {
      console.log('❌ Order not found for orderCode:', orderCode);
      console.log('🔍 Searching in all orders...');
      
      // Debug: List tất cả orders để check
      const allOrders = await Order.find({}).select('orderCode status').limit(10);
      console.log('📋 Recent orders:', allOrders.map(o => ({
        orderCode: o.orderCode,
        status: o.status
      })));
      
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('✅ Order found:', {
      orderId: order._id,
      orderCode: order.orderCode,
      currentStatus: order.status,
      webhookStatus: status
    });

    // Cập nhật trạng thái order
    if (status === 'PAID' && order.status !== 'PAID') {
      order.status = 'PAID';
      order.paidAt = new Date();
      await order.save();
      
      console.log('✅ Order marked as PAID');

      // Add user to purchased courses
      try {
        await enrollUserInCourses(order.userId, order.items);
        console.log('✅ User enrolled in courses successfully');
      } catch (enrollError) {
        console.error('❌ Error enrolling user:', enrollError);
      }
      
    } else if (status === 'CANCELLED') {
      order.status = 'CANCELLED';
      await order.save();
      console.log('✅ Order marked as CANCELLED');
    } else {
      console.log('⚠️ No status update needed:', {
        webhookStatus: status,
        currentStatus: order.status
      });
    }

    console.log('=== WEBHOOK PROCESSED SUCCESSFULLY ===');
    res.json({ 
      success: true,
      message: 'Webhook processed',
      orderStatus: order.status
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Lấy lịch sử đơn hàng
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.courseId', 'title thumbnail');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get order history error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy lịch sử đơn hàng',
      error: error.message
    });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId,
      status: 'PENDING'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy'
      });
    }

    // Hủy với PayOS nếu không phải mock payment
    if (order.paymentLinkId && !order.paymentLinkId.startsWith('mock-')) {
      try {
        await payOS.cancelPaymentLink(order.paymentLinkId);
        console.log('✅ PayOS payment cancelled');
      } catch (payosError) {
        console.log('⚠️ PayOS cancel failed:', payosError.message);
      }
    }

    order.status = 'CANCELLED';
    order.cancelledAt = new Date();
    await order.save();

    console.log('✅ Order cancelled:', orderId);

    res.json({
      success: true,
      message: 'Đơn hàng đã được hủy thành công',
      data: {
        orderId: order._id,
        status: order.status
      }
    });

  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hủy đơn hàng',
      error: error.message
    });
  }
};

// Export functions
exports.createPayment = createPayment; 