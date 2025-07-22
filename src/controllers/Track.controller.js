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



