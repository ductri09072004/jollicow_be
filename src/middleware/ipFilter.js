import { database } from "../data/firebaseConfig.js";

const ipFilter = async (req, res, next) => {
  let clientIP = req.ip || req.connection.remoteAddress;
  if (clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.replace('::ffff:', '');
  }
  console.log('Client IP:', clientIP);

  try {
    const snapshot = await database.ref("Restaurants").once("value");
    const restaurants = snapshot.val();
    // Lấy tất cả ip_wifi từ các nhà hàng
    const allowedIPs = Object.values(restaurants || {}).map(r => r.ip_wifi);
    if (allowedIPs.includes(clientIP) || clientIP === '::1') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Your IP is not allowed.' });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra IP:', error);
    res.status(500).json({ error: 'Lỗi kiểm tra IP' });
  }
};

export default ipFilter; 