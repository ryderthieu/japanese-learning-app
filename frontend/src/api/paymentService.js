import apiService from './config';

class PaymentService {
  // Tạo payment link
  async createPayment(paymentData) {
    try {
      const response = await apiService.post('/payment/create', paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Kiểm tra trạng thái thanh toán
  async checkPaymentStatus(orderId) {
    try {
      const response = await apiService.get(`/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lấy lịch sử đơn hàng
  async getOrderHistory(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/payment/history?${queryString}` : '/payment/history';
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId) {
    try {
      const response = await apiService.delete(`/payment/cancel/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Xử lý lỗi
  handleError(error) {
    if (error.response) {
      // Server trả về lỗi
      return {
        success: false,
        message: error.response.data.message || 'Có lỗi xảy ra',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Không có phản hồi từ server
      return {
        success: false,
        message: 'Không thể kết nối đến server',
        status: 0
      };
    } else {
      // Lỗi khác
      return {
        success: false,
        message: error.message || 'Có lỗi xảy ra',
        status: 0
      };
    }
  }

  // Utility methods
  
  // Format tiền tệ VND
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  // Format trạng thái đơn hàng
  formatOrderStatus(status) {
    const statusMap = {
      'PENDING': 'Chờ thanh toán',
      'PAID': 'Đã thanh toán',
      'CANCELLED': 'Đã hủy',
      'EXPIRED': 'Đã hết hạn'
    };
    return statusMap[status] || status;
  }

  // Kiểm tra đơn hàng còn hiệu lực
  isOrderValid(order) {
    if (order.status !== 'PENDING') return false;
    const now = new Date();
    const expiredAt = new Date(order.expiredAt);
    return now < expiredAt;
  }

  // Tính thời gian còn lại
  getTimeRemaining(expiredAt) {
    const now = new Date();
    const expired = new Date(expiredAt);
    const diff = expired - now;
    
    if (diff <= 0) return { expired: true };
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return {
      expired: false,
      minutes,
      seconds,
      formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`
    };
  }
}

export default new PaymentService(); 