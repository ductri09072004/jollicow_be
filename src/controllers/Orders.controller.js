import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Orders");
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

export const fillerbyResRequests = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant trong body" });
    }

    const requestRef = database.ref("Orders");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const allOrders = snapshot.val();
    const filteredOrders = {};

    // Lọc đơn hàng theo id_restaurant
    Object.keys(allOrders).forEach((key) => {
      const order = allOrders[key];
      if (order.id_restaurant === id_restaurant) {
        filteredOrders[key] = order;
      }
    });

    res.json(filteredOrders);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

// thêm danh sách
export const addRequest = async (req, res) => {
  try {
    const { 
      id_order,
      id_restaurant,
      id_staff,
      id_table,
      note,
      total_price,
      date_create } = req.body;

    if ( !id_order|| !id_restaurant|| !id_staff|| !id_table||!total_price) {
      return res.status(400).json({ error: "Thiếu thông tin giao dịch" });
    }

    const requestRef = database.ref("Orders").push();
    await requestRef.set({
      id_order,
      id_restaurant,
      id_staff,
      id_table,
      note,
      total_price,
      date_create
    });

    res.status(201).json({ message: "Giao dịch đã được thêm", id: requestRef.key });
  } catch (error) {
    console.error("Lỗi khi thêm giao dịch:", error);
    res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
  }
};

//lọc theo trạng thái xác nhận
export const filletbyStatusRequests = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant trong body" });
    }

    const requestRef = database.ref("Orders");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const allOrders = snapshot.val();
    const filteredOrders = {};

    // Lọc theo id_restaurant và status_confirm = true
    Object.keys(allOrders).forEach((key) => {
      const order = allOrders[key];
      if (
        order.id_restaurant === id_restaurant &&
        order.status_confirm === true
      ) {
        filteredOrders[key] = order;
      }
    });

    res.json(filteredOrders);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

//thay đổi status_confirm
export const updateStatusConfirm = async (req, res) => {
  try {
    const { id_order } = req.body;

    if (!id_order) {
      return res.status(400).json({ error: "Thiếu id_order" });
    }

    const ordersRef = database.ref("Orders");
    const snapshot = await ordersRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu đơn hàng" });
    }

    const orders = snapshot.val();
    let orderKey = null;

    // Tìm key của đơn hàng dựa vào id_order
    Object.keys(orders).forEach((key) => {
      if (orders[key].id_order === id_order) {
        orderKey = key;
      }
    });

    if (!orderKey) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });
    }

    const orderRef = database.ref(`Orders/${orderKey}`);
    await orderRef.update({ status_confirm: true });

    res.json({ message: "Cập nhật status_confirm thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
  }
};

//cập nhật status
export const updateStatus = async (req, res) => {
  try {
    const { id_order } = req.body;

    if (!id_order) {
      return res.status(400).json({ error: "Thiếu id_order" });
    }

    const ordersRef = database.ref("Orders");
    const snapshot = await ordersRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu đơn hàng" });
    }

    const orders = snapshot.val();
    let orderKey = null;

    // Tìm key của đơn hàng dựa vào id_order
    Object.keys(orders).forEach((key) => {
      if (orders[key].id_order === id_order) {
        orderKey = key;
      }
    });

    if (!orderKey) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });
    }

    const orderRef = database.ref(`Orders/${orderKey}`);
    await orderRef.update({ status_order: true });

    res.json({ message: "Cập nhật status_orders thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
  }
};

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
  
