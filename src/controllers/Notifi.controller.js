import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Notification");
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

//tạo notifi
export const addRequest = async (req, res) => {
    try {
      const {
        priority,
        status,
        title,
      } = req.body;
  
      // Lấy ngày giờ hiện tại
      const date_create = new Date().toISOString();
  
      if (!title || !priority || !status) {
        return res.status(400).json({ error: "Thiếu thông tin giao dịch" });
      }
  
      const requestRef = database.ref("Notification").push();
      await requestRef.set({
        date_create,
        priority,
        status,
        title,
      });
  
      res.status(201).json({ message: "Giao dịch đã được thêm" });
    } catch (error) {
      console.error("Lỗi khi thêm giao dịch:", error);
      res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
    }
};
  
//sửa notifi
export const updateRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        priority,
        status,
      } = req.body;
  
      if (!id) {
        return res.status(400).json({ error: "Thiếu ID thông báo cần cập nhật" });
      }
  
      const updates = {
        date_create: new Date().toISOString(), // Cập nhật ngày hiện tại
      };
  
      if (title !== undefined) updates.title = title;
      if (priority !== undefined) updates.priority = priority;
      if (status !== undefined) updates.status = status;
  
      await database.ref(`Notification/${id}`).update(updates);
  
      res.status(200).json({ message: "Cập nhật thông báo thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông báo:", error);
      res.status(500).json({ error: "Lỗi khi cập nhật thông báo" });
    }
};
  
//xóa notifi
export const deleteRequest = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Thiếu ID danh mục" });
      }
  
      const requestRef = database.ref(`Notification/${id}`);
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