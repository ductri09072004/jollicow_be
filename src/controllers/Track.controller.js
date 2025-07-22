import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Track-visit");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    res.json(snapshot.val());
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

// Tăng visitCount cho ngày hôm nay hoặc tạo mới nếu chưa có
export const increaseVisitCount = async (req, res) => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    const trackRef = database.ref("Track-visit");
    const snapshot = await trackRef.once("value");
    const data = snapshot.val() || {};

    let foundKey = null;
    let currentCount = 0;
    for (const key in data) {
      if (data[key].date_visit === dateStr) {
        foundKey = key;
        currentCount = data[key].visitCount || 0;
        break;
      }
    }

    if (foundKey) {
      await trackRef.child(foundKey).update({ visitCount: currentCount + 1 });
      return res.status(200).json({ message: "Đã tăng visitCount", date_visit: dateStr, visitCount: currentCount + 1 });
    } else {
      const newRef = await trackRef.push({ date_visit: dateStr, visitCount: 1 });
      return res.status(201).json({ message: "Đã tạo mới ngày visit", date_visit: dateStr, visitCount: 1, id: newRef.key });
    }
  } catch (error) {
    console.error("Lỗi khi tăng visitCount:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi tăng visitCount" });
  }
};

// Tính tổng lượt truy cập
export const getTotalVisits = async (req, res) => {
  try {
    const trackRef = database.ref("Track-visit");
    const snapshot = await trackRef.once("value");
    const data = snapshot.val() || {};

    let total = 0;
    for (const key in data) {
      total += data[key].visitCount || 0;
    }

    // Đếm tổng số nhà hàng
    const resRef = database.ref("Restaurants");
    const resSnap = await resRef.once("value");
    const resData = resSnap.val() || {};
    const totalRestaurants = Object.keys(resData).length;

    // Đếm tổng số tài khoản Staffs và tổng yêu cầu đăng ký (status: inactive)
    const staffRef = database.ref("Staffs");
    const staffSnap = await staffRef.once("value");
    const staffData = staffSnap.val() || {};
    const totalStaffs = Object.keys(staffData).length;
    let totalRegisterRequests = 0;
    for (const key in staffData) {
      if (staffData[key].status === 'inactive') {
        totalRegisterRequests++;
      }
    }

    // Đếm tổng số đơn hàng Orders và tính tổng doanh thu
    const orderRef = database.ref("Orders");
    const orderSnap = await orderRef.once("value");
    const orderData = orderSnap.val() || {};
    const totalOrders = Object.keys(orderData).length;
    let totalRevenue = 0;
    for (const key in orderData) {
      const order = orderData[key];
      if (order.total_price) {
        totalRevenue += Number(order.total_price) || 0;
      }
    }

    res.status(200).json({ totalVisits: total, totalRestaurants, totalStaffs, totalOrders, totalRevenue, totalRegisterRequests });
  } catch (error) {
    console.error("Lỗi khi tính tổng lượt truy cập:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi tính tổng lượt truy cập" });
  }
};



