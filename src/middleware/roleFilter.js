import ipFilter from "./ipFilter.js";

const roleFilter = (req, res, next) => {
  console.log('=== ROLE FILTER DEBUG ===');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
  console.log('X-Real-IP:', req.headers['x-real-ip']);
  console.log('CF-Connecting-IP:', req.headers['cf-connecting-ip']);
  console.log('Starts with /admin:', req.path.startsWith('/admin'));
  console.log('Includes /admin:', req.path.includes('/admin'));
  
  // Bỏ qua OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log('✅ Bỏ qua OPTIONS request (CORS preflight)');
    return next();
  }
  
  // Bỏ qua kiểm tra IP cho routes admin (web nhân viên)
  if (req.path.includes('/admin')) {
    console.log('✅ Bỏ qua kiểm tra IP cho admin route');
    return next();
  }
  
  console.log('🔒 Kiểm tra IP cho khách route');
  // Kiểm tra IP cho routes khách (web khách hàng)
  ipFilter(req, res, next);
};

export default roleFilter; 