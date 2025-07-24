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
    vnp_OrderInfo: `Thanh toán đơn hàng: ${req.body.id_order} - Bàn: ${req.body.id_table} - Mã nhà hàng: ${req.body.restaurant_id}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  const sortedParams = sortObject(vnp_Params);

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params.vnp_SecureHash = signed;
  const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: true });

  res.json({ paymentUrl });
}


function vnpayReturnUrl(req, res) {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const signed = crypto.createHmac('sha512', vnp_HashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  if (secureHash === signed) {
    // Chữ ký hợp lệ
    if (vnp_Params.vnp_ResponseCode === '00') {
      // Parse id_order, id_table, restaurant_id từ vnp_OrderInfo
      let id_order = '';
      let id_table = '';
      let restaurant_id = '';
      if (vnp_Params.vnp_OrderInfo) {
        const matchOrder = vnp_Params.vnp_OrderInfo.match(/đơn hàng: ([^\s-]+)/);
        if (matchOrder) id_order = matchOrder[1];
        const matchTable = vnp_Params.vnp_OrderInfo.match(/Bàn: (.+?) -/i);
        if (matchTable) id_table = matchTable[1].trim();
        const matchRes = vnp_Params.vnp_OrderInfo.match(/Mã nhà hàng: ([^\s]+)/);
        if (matchRes) restaurant_id = matchRes[1];
      }
      const backUrl = `http://jollicow.up.railway.app/menu/generate?id_table=${id_table}&restaurant_id=${restaurant_id}`;

      // Cập nhật trạng thái payment trong database
      import('../data/firebaseConfig.js').then(({ database }) => {
        const ordersRef = database.ref('Orders');
        ordersRef.once('value', snapshot => {
          if (snapshot.exists()) {
            const orders = snapshot.val();
            let orderKey = null;
            Object.keys(orders).forEach((key) => {
              if (orders[key].id_order === id_order) {
                orderKey = key;
              }
            });
            if (orderKey) {
              const orderRef = database.ref(`Orders/${orderKey}`);
              orderRef.update({ payment: 'Đã thanh toán' });
            }
          }
        });
      });

      res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thanh toán thành công</title>
          <link rel="stylesheet" href="/vnpay_return.css">
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✔️</div>
            <h2>Thanh toán thành công!</h2>
            <div class="info">Mã giao dịch: <b>${vnp_Params.vnp_TxnRef}</b></div>
            <div class="info">Số tiền: <b>${vnp_Params.vnp_Amount / 100} VND</b></div>
            <div class="info">Thông tin đơn hàng: <b>${vnp_Params.vnp_OrderInfo}</b></div>
            <a href="${backUrl}" class="btn-home">Quay về trang chủ</a>
          </div>
        </body>
        </html>
      `);
    } else {
      let id_table = '';
      let restaurant_id = '';
      if (vnp_Params.vnp_OrderInfo) {
        const matchTable = vnp_Params.vnp_OrderInfo.match(/bàn: ([^\s-]+)/);
        if (matchTable) id_table = matchTable[1];
        const matchRes = vnp_Params.vnp_OrderInfo.match(/Mã nhà hàng: ([^\s]+)/);
        if (matchRes) restaurant_id = matchRes[1];
      }
      const backUrl = `http://jollicow.up.railway.app/menu/generate?id_table=${id_table}&restaurant_id=${restaurant_id}`;
      res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thanh toán thất bại</title>
          <link rel="stylesheet" href="/vnpay_return.css">
        </head>
        <body>
          <div class="container">
            <div class="fail-icon">❌</div>
            <h2>Thanh toán thất bại!</h2>
            <div class="info">Mã lỗi: <b>${vnp_Params.vnp_ResponseCode}</b></div>
            <a href="${backUrl}" class="btn-home">Quay về trang chủ</a>
          </div>
        </body>
        </html>
      `);
    }
  } else {
    // Sai chữ ký
    // Tạo lại backUrl để dùng cho cả trường hợp sai chữ ký
    let id_table = '';
    let restaurant_id = '';
    if (vnp_Params.vnp_OrderInfo) {
      const matchTable = vnp_Params.vnp_OrderInfo.match(/bàn: ([^\s-]+)/);
      if (matchTable) id_table = matchTable[1];
      const matchRes = vnp_Params.vnp_OrderInfo.match(/Mã nhà hàng: ([^\s]+)/);
      if (matchRes) restaurant_id = matchRes[1];
    }
    const backUrl = `http://jollicow.up.railway.app/menu/generate?id_table=${id_table}&restaurant_id=${restaurant_id}`;
    res.status(400).send(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sai chữ ký</title>
        <link rel="stylesheet" href="/vnpay_return.css">
      </head>
      <body>
        <div class="container">
          <div class="fail-icon">❌</div>
          <h2>Sai chữ ký! Giao dịch không hợp lệ.</h2>
          <a href="${backUrl}" class="btn-home">Quay về trang chủ</a>
        </div>
      </body>
      </html>
    `);
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