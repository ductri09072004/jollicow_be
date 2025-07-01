import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Tables");
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

//lọc theo bàn
export const softRequests = async (req, res) => {
  const {id_table} = req.body;

  try {
    const requestRef = database.ref("Tables");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const tables = snapshot.val();
    const filteredMenus = [];

    // Lọc các menu theo điều kiện
    for (const key in tables) {
      const table = tables[key];
      if (
        table.id_table === id_table 
      ) {
        filteredMenus.push({ id: key, ...table });
      }
    }

    res.json(filteredMenus);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

//auth id_table và id_restaurant
export const softAllRequests = async (req, res) => {
  const { id_table, restaurant_id } = req.body;

  try {
    const requestRef = database.ref("Tables");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const tables = snapshot.val();
    let found = false;

    // Kiểm tra từng bản ghi trong Tables
    for (const key in tables) {
      const table = tables[key];
      if (
        table.id_table === id_table &&
        table.restaurant_id === restaurant_id
      ) {
        found = true;
        break;
      }
    }

    res.json({ exists: found });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

//thêm danh sách bàn
export const addRequest = async (req, res) => {
  try {
    const { id_table, restaurant_id } = req.body;

    if (!id_table || !restaurant_id) {
      return res.status(400).json({ error: "Thiếu thông tin bàn" });
    }

    const tablesRef = database.ref("Tables");
    const snapshot = await tablesRef.once("value");
    const tables = snapshot.val() || {};

    // 🔍 Kiểm tra xem trong cùng restaurant_id đã có id_table chưa
    const isDuplicate = Object.values(tables).some(
      (table) =>
        table.restaurant_id === restaurant_id &&
        table.id_table === id_table
    );

    if (isDuplicate) {
      return res.status(409).json({
        error: "Bàn đã tồn tại trong nhà hàng này",
      });
    }

    // ✅ Thêm bàn nếu không trùng
    const requestRef = tablesRef.push();
    await requestRef.set({
      id_table,
      restaurant_id,
    });

    res.status(201).json({ message: "Bàn đã được thêm", id: requestRef.key });
  } catch (error) {
    console.error("Lỗi khi thêm bàn:", error);
    res.status(500).json({ error: "Lỗi khi thêm bàn" });
  }
};

// xóa danh sách
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Thiếu ID danh mục" });
    }

    const requestRef = database.ref(`Tables/${id}`);
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


// Cập nhật bàn
export const updateTableByIdTable = async (req, res) => {
  try {
    const { id_table, id_newtable, restaurant_id } = req.body;

    if (!id_table || !id_newtable || !restaurant_id) {
      return res.status(400).json({ error: "Thiếu dữ liệu id_table, id_newtable hoặc restaurant_id" });
    }

    const tableRef = database.ref("Tables");
    const snapshot = await tableRef.once("value");
    const data = snapshot.val();

    let updated = false;

    for (const key in data) {
      const table = data[key];
      if (table.id_table === id_table && table.restaurant_id === restaurant_id) {
        await tableRef.child(key).update({ id_table: id_newtable });
        updated = true;
        break; // Dừng sau khi cập nhật 1 bản ghi
      }
    }

    if (updated) {
      res.status(200).json({ message: `Đã cập nhật bàn ${id_table} thành ${id_newtable}` });
    } else {
      res.status(404).json({ error: `Không tìm thấy bàn có id_table = ${id_table} và restaurant_id = ${restaurant_id}` });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật bàn:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật bàn" });
  }
};

//lọc theo res
export const softRestaurantRequests = async (req, res) => {
  const {restaurant_id} = req.body;

  try {
    const requestRef = database.ref("Tables");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const tables = snapshot.val();
    const filteredMenus = [];

    // Lọc các menu theo điều kiện
    for (const key in tables) {
      const table = tables[key];
      if (
        table.restaurant_id === restaurant_id 
      ) {
        filteredMenus.push({ id: key, ...table });
      }
    }

    res.json(filteredMenus);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};


