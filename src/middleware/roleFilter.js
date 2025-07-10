import ipFilter from "./ipFilter.js";

const roleFilter = (req, res, next) => {
  // Bỏ qua kiểm tra IP cho routes admin (web nhân viên) và staffs
  if (req.path.startsWith('/admin')) {
    return next();
  }
  
  // Kiểm tra IP cho routes khách (web khách hàng)
  ipFilter(req, res, next);
};

export default roleFilter; 