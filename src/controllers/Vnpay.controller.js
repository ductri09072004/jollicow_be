import qs from 'qs';
import crypto from 'crypto';

const vnp_TmnCode = 'D0RFC8HZ';
const vnp_HashSecret = 'CKNU5RUGONR9QM07YV7VF6O1ZVXM3NFW';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = 'https://jollicowbe-admin.up.railway.app/api/admin/pay/vnpay_return';

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    // Encode value theo chuẩn VNPay
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

function createPaymentUrl(req, res) {
  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const tmnCode = vnp_TmnCode;
  const secretKey = vnp_HashSecret;
  const vnpUrl = vnp_Url;
  const returnUrl = vnp_ReturnUrl;

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const orderId = date.getTime();

  const amount = req.body.amount * 100;

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId.toString(),
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: 'other',
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  // Bước 1: Sắp xếp
  const sortedParams = sortObject(vnp_Params);

  // Bước 2: Tạo chuỗi dữ liệu ký
  const signData = qs.stringify(sortedParams, { encode: false });

  // Bước 3: Tạo chữ ký
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // Bước 4: Gán vào bản gốc
  vnp_Params.vnp_SecureHash = signed;

  // Bước 5: Tạo URL thanh toán
  const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: true });

  res.json({ paymentUrl });
}


function vnpayReturnUrl(req, res) {
  // 1. Lấy tất cả tham số từ query
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;

  // 2. Sắp xếp tham số
  const sortedParams = sortObject(vnp_Params);

  // 3. Tạo chuỗi ký
  const signData = qs.stringify(sortedParams, { encode: false });

  // 4. Tạo chữ ký mới
  const signed = crypto.createHmac('sha512', vnp_HashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  // 5. So sánh
  if (secureHash === signed) {
    // Chữ ký hợp lệ
    if (vnp_Params.vnp_ResponseCode === '00') {
      res.send(`<h2>Thanh toán thành công!</h2><p>Mã giao dịch: ${vnp_Params.vnp_TxnRef}</p><p>Số tiền: ${vnp_Params.vnp_Amount / 100} VND</p><p>Thông tin đơn hàng: ${vnp_Params.vnp_OrderInfo}</p>`);
    } else {
      res.send(`<h2>Thanh toán thất bại!</h2><p>Mã lỗi: ${vnp_Params.vnp_ResponseCode}</p>`);
    }
  } else {
    // Sai chữ ký
    res.status(400).send('Sai chữ ký! Giao dịch không hợp lệ.');
  }
}

// Debug endpoint để so sánh chữ ký VNPay
function debugVnpayHash(req, res) {
  // Lấy tất cả tham số từ query hoặc body
  const vnp_Params = { ...req.query, ...req.body };
  const clientHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;

  // Sắp xếp tham số
  const sortedParams = sortObject(vnp_Params);
  // Tạo chuỗi ký
  const signData = qs.stringify(sortedParams, { encode: false });
  // Tạo chữ ký mới
  const serverHash = crypto.createHmac('sha512', vnp_HashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  // So sánh
  const match = clientHash === serverHash;
  res.json({
    match,
    clientHash,
    serverHash,
    signData,
    params: sortedParams
  });
}

export { createPaymentUrl, vnpayReturnUrl, debugVnpayHash };