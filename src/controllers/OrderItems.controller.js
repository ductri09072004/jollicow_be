import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("OrderItems");
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

// thêm danh sách
export const addRequest = async (req, res) => {
  try {
    const {
      id_dishes,
      id_order,
      id_topping = [],
      note = "",
      price,
      quantity
    } = req.body;

    // Kiểm tra thông tin cần thiết
    if (!id_dishes || !id_order || typeof price !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ error: "Thiếu hoặc sai thông tin món ăn" });
    }

    const requestRef = database.ref("OrderItems").push(); // Thay vì 'Account', lưu vào 'OrderDetails'
    await requestRef.set({
      id_dishes,
      id_order,
      id_topping,
      note,
      price,
      quantity
    });

    res.status(201).json({ message: "Chi tiết đơn hàng đã được thêm", id: requestRef.key });
  } catch (error) {
    console.error("Lỗi khi thêm chi tiết đơn hàng:", error);
    res.status(500).json({ error: "Lỗi khi thêm chi tiết đơn hàng" });
  }
};



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
  
