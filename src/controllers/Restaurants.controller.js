import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Restaurants");
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


function generateRandomId() {
  const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 chữ số
  return `CH${randomChar}${randomNumber}`;
}

//thêm danh sách
export const addRequest = async (req, res) => {
  try {
    const { 
      address,
      id_restaurant,
      name_restaurant,
      number_tax,
      ip_wifi = ""
    } = req.body;

    if (!address || !name_restaurant ||!number_tax) {
      return res.status(400).json({ error: "Thiếu thông tin giao dịch" });
    }

    const finalIdRestaurant = id_restaurant || generateRandomId();

    const requestRef = database.ref("Restaurants").push();
    await requestRef.set({
      address,
      id_restaurant: finalIdRestaurant,
      name_restaurant,
      number_tax,
      ip_wifi 
    });

    res.status(201).json({ message: "Giao dịch đã được thêm", id: requestRef.key, id_restaurant: finalIdRestaurant });
  } catch (error) {
    console.error("Lỗi khi thêm giao dịch:", error);
    res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
  }
};


//xóa danh sách
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Thiếu ID danh mục" });
    }

    const requestRef = database.ref(`Restaurants/${id}`);
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    await requestRef.remove();
    res.status(200).json({ message: "Danh mục đã được xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    res.status(500).json({ error: "Lỗi khi xóa danh mục" });
  }
};

//Cập nhật giao dịch
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID giao dịch" });
    }

    const requestRef = database.ref(`Restaurants/${id}`);
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Giao dịch không tồn tại" });
    }

    // Chỉ cho phép cập nhật các trường này
    const allowedFields = ["address","ip_wifi","name_restaurant","number_tax"];
    const filteredData = {};

    for (const key of allowedFields) {
      if (updatedData.hasOwnProperty(key)) {
        filteredData[key] = updatedData[key];
      }
    }

    // Kiểm tra nếu không có trường nào hợp lệ để cập nhật
    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ error: "Không có trường hợp lệ để cập nhật" });
    }

    await requestRef.update(filteredData);
    res.status(200).json({ message: "Giao dịch đã được cập nhật" });
  } catch (error) {
    console.error("Lỗi khi cập nhật giao dịch:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật giao dịch" });
  }
};


//Cập nhật IP_Wifi
export const updateIPRequest = async (req, res) => {
  try {
    const { id_restaurant, ip_wifi } = req.body;

    if (!id_restaurant || !ip_wifi) {
      return res.status(400).json({ error: "Thiếu id_restaurant hoặc ip_wifi trong body" });
    }

    const restaurantsRef = database.ref("Restaurants");
    const snapshot = await restaurantsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có nhà hàng nào trong hệ thống" });
    }

    let matchedKey = null;

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data.id_restaurant === id_restaurant) {
        matchedKey = childSnapshot.key;
      }
    });

    if (!matchedKey) {
      return res.status(404).json({ error: "Không tìm thấy nhà hàng với id_restaurant tương ứng" });
    }

    const updateRef = database.ref(`Restaurants/${matchedKey}`);
    await updateRef.update({ ip_wifi });

    res.status(200).json({ message: "Cập nhật ip_wifi thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật ip_wifi:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật ip_wifi" });
  }
};

//lọc IP theo res
export const getIPByRestaurantId = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant trong body" });
    }

    const restaurantsRef = database.ref("Restaurants");
    const snapshot = await restaurantsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có nhà hàng nào trong hệ thống" });
    }

    let ip_wifi = null;

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data.id_restaurant === id_restaurant) {
        ip_wifi = data.ip_wifi || null;
      }
    });

    if (!ip_wifi) {
      return res.status(404).json({ error: "Không tìm thấy ip_wifi cho id_restaurant đã cho" });
    }

    res.status(200).json({ ip_wifi });
  } catch (error) {
    console.error("Lỗi khi lấy ip_wifi:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy ip_wifi" });
  }
};

