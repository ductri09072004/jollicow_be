import { database } from "../data/firebaseConfig.js";

// lấy danh sách bàn
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Menus");
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

// lấy danh sách menu theo điều kiện
export const softRequests = async (req, res) => {
  const { id_category } = req.body;

  try {
    const requestRef = database.ref("Menus");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const menus = snapshot.val();
    const filteredMenus = [];

    // Lọc các menu theo điều kiện
    for (const key in menus) {
      const menu = menus[key];
      if (
        // menu.restaurant_id === restaurant_id &&
        menu.id_category === id_category
      ) {
        filteredMenus.push({ id: key, ...menu });
      }
    }

    res.json(filteredMenus);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};



// thêm danh sách
// export const addRequest = async (req, res) => {
//   try {
//     const { 
//       date_buy,
//       email,
//       type_id,
//       user_id } = req.body;

//     if ( !date_buy|| !email|| !type_id|| !user_id) {
//       return res.status(400).json({ error: "Thiếu thông tin giao dịch" });
//     }

//     const requestRef = database.ref("Account").push();
//     await requestRef.set({
//         date_buy,
//         email,
//         type_id,
//         user_id 
//     });

//     res.status(201).json({ message: "Giao dịch đã được thêm", id: requestRef.key });
//   } catch (error) {
//     console.error("Lỗi khi thêm giao dịch:", error);
//     res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
//   }
// };

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
  
