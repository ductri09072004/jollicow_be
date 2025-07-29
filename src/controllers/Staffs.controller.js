import { database } from "../data/firebaseConfig.js";
import bcrypt from "bcryptjs";

// utils/validatePassword.js
export const validatePasswordStrength = (password) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

// utils/validatePhone.js
export const validatePhoneNumber = (phone) => {
  // Kiểm tra số điện thoại phải có đúng 10 chữ số
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Kiểm tra số điện thoại đã tồn tại hay chưa
export const checkPhoneExists = async (phone) => {
  try {
    const staffsRef = database.ref("Staffs");
    const snapshot = await staffsRef.once("value");
    const staffs = snapshot.val() || {};

    const phoneExists = Object.values(staffs).some(
      (staff) => staff.phone === phone
    );
    
    return phoneExists;
  } catch (error) {
    console.error("Lỗi khi kiểm tra số điện thoại:", error);
    throw error;
  }
};

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Staffs");
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

//auth account
export const authenticateUser = async (req, res) => {
  const { phone, password_hash } = req.body; // `password_hash` ở đây là password người dùng nhập

  if (!phone || !password_hash) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
  }

  if (!validatePhoneNumber(phone)) {
    return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
  }

  try {
    const staffRef = database.ref("Staffs");
    const snapshot = await staffRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Không có dữ liệu nhân viên" });
    }

    const staffs = snapshot.val();
    let isAuthenticated = false;
    let userInfo = null;

    // Duyệt qua tất cả nhân viên
    for (const key of Object.keys(staffs)) {
      const staff = staffs[key];

      if (staff.phone === phone) {
        // Kiểm tra trạng thái tài khoản
        if (staff.status === 'inactive') {
          return res.status(403).json({
            success: false,
            message: "Tài khoản đã chưa được duyệt hoặc bị khóa",
          });
        }
        const match = await bcrypt.compare(password_hash, staff.password_hash);
        if (match) {
          isAuthenticated = true;
          userInfo = {
            id_staff: staff.id_staff,
            name: staff.name,
            phone: staff.phone,
            role: staff.role,
            restaurant_id: staff.restaurant_id,
          };
          break;
        }
      }
    }

    if (isAuthenticated) {
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        user: userInfo,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Sai số điện thoại hoặc mật khẩu",
      });
    }
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};

// register accout
function generateRandomId() {
  const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 chữ số
  return `NV${randomChar}${randomNumber}`;
}
export const addRequest = async (req, res) => {
  try {
    const {
      name,
      password_hash,
      phone,
      restaurant_id,
      status ="inactive",
      role = "admin", 
    } = req.body;

    if (!name || !password_hash || !phone) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const staffsRef = database.ref("Staffs");

    // 🔍 Kiểm tra phone đã tồn tại chưa
    const snapshot = await staffsRef.once("value");
    const staffs = snapshot.val() || {};

    const phoneExists = Object.values(staffs).some(
      (staff) => staff.phone === phone
    );
    if (phoneExists) {
      return res.status(409).json({ error: "Số điện thoại đã tồn tại" });
    }

    if (!validatePasswordStrength(password_hash)) {
      return res.status(400).json({
        error:
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt",
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
    }

    // 🔁 Tạo id_staff mới và kiểm tra trùng
    let id_staff;
    let isDuplicate = true;
    do {
      id_staff = generateRandomId();
      isDuplicate = Object.values(staffs).some(
        (staff) => staff.id_staff === id_staff
      );
    } while (isDuplicate);

    // 🔒 Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    // 🔑 Tạo key Firebase (id chính trong DB)
    const requestRef = staffsRef.push();
    const id = requestRef.key;

    // ✅ Thêm vào database
    await requestRef.set({
      id_staff,
      name,
      password_hash: hashedPassword,
      phone,
      restaurant_id: restaurant_id || "",
      status: status || "active",
      role, // 👈 thêm role ở đây
    });

    res.status(201).json({ message: "Tài khoản đã được thêm", id, id_staff });
  } catch (error) {
    console.error("Lỗi khi thêm tài khoản:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi thêm tài khoản" });
  }
};

//forget pass
export const resetPassword = async (req, res) => {
  const { phone, newPassword } = req.body;

  // 🔒 Kiểm tra đầu vào
  if (!phone || !newPassword) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
  }

  if (!validatePhoneNumber(phone)) {
    return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
  }

  if (!validatePasswordStrength(newPassword)) {
    return res.status(400).json({
      error: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt",
    });
  }

  try {
    const staffsRef = database.ref("Staffs");
    const snapshot = await staffsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu nhân viên" });
    }

    const staffs = snapshot.val();
    let staffKeyToUpdate = null;

    // 🔍 Tìm nhân viên theo số điện thoại
    for (const key of Object.keys(staffs)) {
      if (staffs[key].phone === phone) {
        staffKeyToUpdate = key;
        break;
      }
    }

    if (!staffKeyToUpdate) {
      return res.status(404).json({ error: "Số điện thoại không tồn tại" });
    }

    // 🔐 Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Cập nhật mật khẩu mới
    await staffsRef.child(staffKeyToUpdate).update({
      password_hash: hashedPassword,
    });

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

//xóa acc
export const deleteAccount = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại" });
  }

  if (!validatePhoneNumber(phone)) {
    return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
  }

  try {
    const staffsRef = database.ref("Staffs");
    const snapshot = await staffsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu nhân viên" });
    }

    const staffs = snapshot.val();
    let staffKeyToDelete = null;

    // 🔍 Tìm key của tài khoản cần xóa
    for (const key of Object.keys(staffs)) {
      if (staffs[key].phone === phone) {
        staffKeyToDelete = key;
        break;
      }
    }

    if (!staffKeyToDelete) {
      return res.status(404).json({ error: "Không tìm thấy tài khoản với số điện thoại đã cho" });
    }

    // 🗑️ Xóa tài khoản
    await staffsRef.child(staffKeyToDelete).remove();

    return res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

//cập nhật id_restaurant
export const addIDResRequest = async (req, res) => {
  try {
    const { id_staff, restaurant_id } = req.body;

    if (!id_staff) {
      return res.status(400).json({ error: "Thiếu id_staff để cập nhật" });
    }

    const staffsRef = database.ref("Staffs");
    const snapshot = await staffsRef.once("value");
    const staffs = snapshot.val() || {};

    const staffEntry = Object.entries(staffs).find(
      ([_, staff]) => staff.id_staff === id_staff
    );

    if (!staffEntry) {
      return res.status(404).json({ error: "Không tìm thấy staff với id_staff này" });
    }

    const [firebaseKey] = staffEntry;

    await staffsRef.child(firebaseKey).update({
      restaurant_id: restaurant_id || "",
    });

    return res.status(200).json({
      message: "Đã cập nhật restaurant_id cho staff",
      id_staff,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật staff:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật staff" });
  }
};

//Sửa acc
export const fixStaffStatus = async (req, res) => {
  try {
    const { id_staff, name, status } = req.body;

    if (!id_staff) {
      return res.status(400).json({ error: "Thiếu id_staff" });
    }

    const tableRef = database.ref("Staffs");
    const snapshot = await tableRef.once("value");
    const data = snapshot.val();

    let updated = false;

    for (const key in data) {
      const staff = data[key];
      if (staff.id_staff === id_staff) {
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (status !== undefined) updateData.status = status;

        await tableRef.child(key).update(updateData);
        updated = true;
        break; // Dừng sau khi cập nhật nhân viên
      }
    }

    if (updated) {
      res.status(200).json({ message: `Đã cập nhật nhân viên ${id_staff}` });
    } else {
      res.status(404).json({ error: `Không tìm thấy nhân viên có id_staff = ${id_staff}` });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật nhân viên" });
  }
};

//get acc inactive
export const getInactiveStaffs = async (req, res) => {
  try {
    const tableRef = database.ref("Staffs");
    const snapshot = await tableRef.once("value");
    const data = snapshot.val();

    const inactiveStaffs = {};

    for (const key in data) {
      const staff = data[key];
      if (staff.status === "inactive") {
        inactiveStaffs[key] = staff; // ✅ gán vào object với key là id gốc
      }
    }

    res.status(200).json(inactiveStaffs);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên inactive:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh sách nhân viên inactive" });
  }
};


//xóa acc + restaurant
export const deleteAccResRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID nhân viên" });
    }

    const staffRef = database.ref(`Staffs/${id}`);
    const staffSnap = await staffRef.once("value");

    if (!staffSnap.exists()) {
      return res.status(404).json({ error: "Nhân viên không tồn tại" });
    }

    const staffData = staffSnap.val();
    const staffRestaurantId = staffData.restaurant_id;

    // Xóa nhân viên
    await staffRef.remove();

    // Tìm trong Restaurants nếu có id_restaurant trùng thì xóa
    if (staffRestaurantId) {
      const restaurantsRef = database.ref("Restaurants");
      const restaurantSnap = await restaurantsRef.once("value");
      const restaurants = restaurantSnap.val();

      for (const key in restaurants) {
        const restaurant = restaurants[key];
        if (restaurant.id_restaurant === staffRestaurantId) {
          await restaurantsRef.child(key).remove();
          console.log(`Đã xóa nhà hàng có id_restaurant = ${staffRestaurantId}`);
          break; // Dừng sau khi xóa
        }
      }
    }

    res.status(200).json({ message: "Đã xóa nhân viên và (nếu có) nhà hàng liên quan." });
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên và nhà hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa nhân viên hoặc nhà hàng" });
  }
};

// Kiểm tra số điện thoại đã tồn tại hay chưa (API endpoint)
export const checkPhoneExistsAPI = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại" });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
    }

    const exists = await checkPhoneExists(phone);

    res.status(200).json({
      phone: phone,
      exists: exists,
      message: exists ? "Số điện thoại đã tồn tại" : "Số điện thoại chưa tồn tại"
    });

  } catch (error) {
    console.error("Lỗi khi kiểm tra số điện thoại:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi kiểm tra số điện thoại" });
  }
};




  
