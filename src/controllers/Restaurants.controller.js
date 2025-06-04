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
      number_tax 
    } = req.body;

    if (!address || !name_restaurant) {
      return res.status(400).json({ error: "Thiếu thông tin giao dịch" });
    }

    const finalIdRestaurant = id_restaurant || generateRandomId();

    const requestRef = database.ref("Restaurants").push();
    await requestRef.set({
      address,
      id_restaurant: finalIdRestaurant,
      name_restaurant,
      number_tax 
    });

    res.status(201).json({ message: "Giao dịch đã được thêm", id: requestRef.key, id_restaurant: finalIdRestaurant });
  } catch (error) {
    console.error("Lỗi khi thêm giao dịch:", error);
    res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
  }
};


// // xóa danh sách
// export const deleteRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "Thiếu ID danh mục" });
//     }

//     const requestRef = database.ref(`Account/${id}`);
//     const snapshot = await requestRef.once("value");

//     if (!snapshot.exists()) {
//       return res.status(404).json({ error: "Danh mục không tồn tại" });
//     }

//     await requestRef.remove();
//     res.status(200).json({ message: "Danh mục đã được xóa" });
//   } catch (error) {
//     console.error("Lỗi khi xóa danh mục:", error);
//     res.status(500).json({ error: "Lỗi khi xóa danh mục" });
//   }
// };

// // Cập nhật giao dịch
// export const updateRequest = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const updatedData = req.body;
  
//       if (!id) {
//         return res.status(400).json({ error: "Thiếu ID giao dịch" });
//       }
  
//       const requestRef = database.ref(`Account/${id}`);
//       const snapshot = await requestRef.once("value");
  
//       if (!snapshot.exists()) {
//         return res.status(404).json({ error: "Giao dịch không tồn tại" });
//       }
  
//       await requestRef.update(updatedData);
//       res.status(200).json({ message: "Giao dịch đã được cập nhật" });
//     } catch (error) {
//       console.error("Lỗi khi cập nhật giao dịch:", error);
//       res.status(500).json({ error: "Lỗi khi cập nhật giao dịch" });
//     }
//   };
  
