import { database } from "../data/firebaseConfig.js";

const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // Lấy IP đầu tiên trong chuỗi (nếu có nhiều IP)
    return xForwardedFor.split(',')[0].trim().replace(/^::ffff:/, '');
  }
  // Nếu không có x-forwarded-for, lấy remoteAddress và chuẩn hóa
  return (req.connection.remoteAddress || '').replace(/^::ffff:/, '');
};

const ipFilter = async (req, res, next) => {
  const clientIP = getClientIp(req);
  console.log('Client IP:', clientIP);

  try {
    const snapshot = await database.ref("Restaurants").once("value");
    const restaurants = snapshot.val();
    // Chuẩn hóa tất cả IP trong DB và loại bỏ IP rỗng
    const allowedIPs = Object.values(restaurants || {})
      .map(r => (r.ip_wifi || '').trim())
      .filter(ip => ip);
    console.log('Allowed IPs:', allowedIPs);

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