// utils/vnpay.js
const crypto = require('crypto');
const querystring = require('querystring');
const moment = require('moment');

/**
 * Cấu hình VNPay
 * Lưu ý: Trong môi trường sản phẩm, nên lưu các thông tin này trong biến môi trường (.env)
 */
const vnpayConfig = {
  tmnCode: 'YOUR_TMN_CODE',  // Terminal ID từ VNPay cung cấp
  secretKey: 'YOUR_SECRET_KEY', // Secret Key từ VNPay cung cấp
  vnpayUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL sandbox (thay đổi khi lên production)
  returnUrl: 'http://yourdomain.com/payment/vnpay/callback', // URL callback
};

/**
 * Sắp xếp object theo key theo alphabet
 * @param {Object} obj - Object cần sắp xếp
 * @returns {Object} - Object đã sắp xếp
 */
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      sorted[key] = obj[key];
    }
  }
  
  return sorted;
}

/**
 * Tạo URL thanh toán VNPay
 * 
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @returns {String} - URL thanh toán VNPay
 */
function createPaymentUrl(paymentData) {
  const { orderId, amount, orderInfo, returnUrl } = paymentData;
  
  const tmnCode = vnpayConfig.tmnCode;
  const secretKey = vnpayConfig.secretKey;
  const vnpUrl = vnpayConfig.vnpayUrl;
  
  // Tạo ngày thanh toán theo định dạng YYYYMMDDHHmmss
  const createDate = moment().format('YYYYMMDDHHmmss');
  
  // Ngôn ngữ hiển thị trên cổng thanh toán
  const locale = 'vn'; // 'vn' hoặc 'en'
  
  // Đơn vị tiền tệ
  const currCode = 'VND';
  
  // Tạo đối tượng params cho VNPay
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_Amount: amount * 100, // Nhân với 100 vì VNPay tính số tiền theo đơn vị 100 đồng
    vnp_ReturnUrl: returnUrl || vnpayConfig.returnUrl,
    vnp_IpAddr: '127.0.0.1', // IP của người dùng hoặc server
    vnp_CreateDate: createDate,
    vnp_OrderType: 'other', // Loại hàng hóa: fashion, electronics, other
  };
  
  // Sắp xếp params theo thứ tự alphabet
  const sortedParams = sortObject(vnp_Params);
  
  // Tạo chuỗi ký từ các params
  const signData = querystring.stringify(sortedParams, { encode: false });
  
  // Tạo chữ ký bằng HMAC SHA512
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  // Thêm chữ ký vào params
  sortedParams['vnp_SecureHash'] = signed;
  
  // Tạo URL thanh toán
  const paymentUrl = vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false });
  
  return paymentUrl;
}

/**
 * Xác minh thanh toán từ VNPay
 * 
 * @param {Object} vnpParams - Tham số từ VNPay
 * @returns {Boolean} - Kết quả xác minh
 */
function verifyPayment(vnpParams) {
  // Lưu lại secure hash từ VNPay
  const secureHash = vnpParams['vnp_SecureHash'];
  
  // Xóa checksum để tạo checksum mới
  delete vnpParams['vnp_SecureHash'];
  if (vnpParams['vnp_SecureHashType']) {
    delete vnpParams['vnp_SecureHashType'];
  }
  
  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = sortObject(vnpParams);
  
  // Tạo chuỗi ký từ các params
  const secretKey = vnpayConfig.secretKey;
  const signData = querystring.stringify(sortedParams, { encode: false });
  
  // Tạo chữ ký bằng HMAC SHA512
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  // So sánh chữ ký từ VNPay với chữ ký tính toán
  return secureHash === signed;
}

/**
 * Kiểm tra kết quả thanh toán từ VNPay
 * 
 * @param {Object} vnpParams - Tham số từ VNPay
 * @returns {Object} - Kết quả thanh toán
 */
function checkPaymentStatus(vnpParams) {
  // Kiểm tra chữ ký
  const isValidSignature = verifyPayment(vnpParams);
  if (!isValidSignature) {
    return {
      success: false,
      message: 'Chữ ký không hợp lệ'
    };
  }
  
  // Kiểm tra mã phản hồi từ VNPay
  const responseCode = vnpParams['vnp_ResponseCode'];
  
  // Danh sách mã lỗi phổ biến
  const responseCodes = {
    '00': 'Thanh toán thành công',
    '07': 'Trừ tiền thành công, giao dịch bị nghi ngờ',
    '09': 'Giao dịch không thành công',
    '10': 'Lỗi kỹ thuật',
    '11': 'Giao dịch không thành công do thẻ hết hạn',
    '12': 'Giao dịch không thành công do thẻ bị khóa',
    '13': 'Giao dịch không thành công do không đủ số dư',
    '24': 'Giao dịch không thành công',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Tài khoản vượt quá hạn mức thanh toán',
    '75': 'Ngân hàng đang bảo trì',
    '79': 'Thẻ chưa đăng ký dịch vụ',
    '99': 'Người dùng hủy giao dịch'
  };
  
  const isSuccess = responseCode === '00';
  const message = responseCodes[responseCode] || 'Mã lỗi không xác định';
  
  return {
    success: isSuccess,
    message: message,
    orderId: vnpParams['vnp_TxnRef'],
    amount: vnpParams['vnp_Amount'] / 100, // Chia cho 100 để lấy số tiền thực
    transactionId: vnpParams['vnp_TransactionNo'],
    bankCode: vnpParams['vnp_BankCode'],
    paymentTime: vnpParams['vnp_PayDate'],
    responseCode
  };
}

module.exports = {
  createPaymentUrl,
  verifyPayment,
  checkPaymentStatus,
  vnpayConfig,
  sortObject
};