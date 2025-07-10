import { database } from "../data/firebaseConfig.js";

const ipFilter = async (req, res, next) => {
  let clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  
  // Nếu x-forwarded-for có nhiều IP, lấy IP đầu tiên
  if (clientIP && clientIP.includes(',')) {
    clientIP = clientIP.split(',')[0].trim();
  }
  
  if (clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.replace('::ffff:', '');
  }
  
  console.log('Client IP:', clientIP);
  console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
  console.log('Real IP:', req.ip);

  try {
    const snapshot = await database.ref("Restaurants").once("value");
    const restaurants = snapshot.val();
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