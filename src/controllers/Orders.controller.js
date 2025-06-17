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
export const filterByStatusRequests = async (req, res) => {
  try {
    const { id_restaurant, status_order } = req.body;

    if (!id_restaurant || !status_order) {
      return res.status(400).json({ error: "Thiếu id_restaurant hoặc status_order trong body" });
    }

    const requestRef = database.ref("Orders");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const allOrders = snapshot.val();
    const filteredOrders = {};

    Object.keys(allOrders).forEach((key) => {
      const order = allOrders[key];

      if (
        order.id_restaurant === id_restaurant &&
        order.status_order === status_order
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

//cập nhật status_order
export const updateStatus = async (req, res) => {
  try {
    const { id_order, status_order } = req.body;

    if (!id_order || !status_order) {
      return res.status(400).json({ error: "Thiếu id_order hoặc status_order" });
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
    await orderRef.update({ status_order });

    res.json({ message: `Cập nhật trạng thái đơn hàng thành ${status_order} thành công` });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
  }
};


//hàm xóa order và orderitem
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params; // Firebase key của đơn hàng trong bảng Orders

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID đơn hàng (key)" });
    }

    // Bước 1: Lấy đơn hàng để truy xuất id_order
    const orderRef = database.ref(`Orders/${id}`);
    const orderSnapshot = await orderRef.once("value");

    if (!orderSnapshot.exists()) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });
    }

    const orderData = orderSnapshot.val();
    const { id_order } = orderData;

    if (!id_order) {
      return res.status(400).json({ error: "Đơn hàng không có id_order để liên kết xóa" });
    }

    // Bước 2: Xóa đơn hàng trong bảng Orders
    await orderRef.remove();

    // Bước 3: Duyệt bảng OrderItems và xóa những item có id_order trùng
    const orderItemsRef = database.ref("OrderItems");
    const itemsSnapshot = await orderItemsRef.once("value");

    if (itemsSnapshot.exists()) {
      const items = itemsSnapshot.val();
      const deletions = [];

      Object.keys(items).forEach((itemKey) => {
        if (items[itemKey].id_order === id_order) {
          deletions.push(database.ref(`OrderItems/${itemKey}`).remove());
        }
      });

      await Promise.all(deletions);
    }

    res.status(200).json({
      message: `Đã xóa đơn hàng ${id_order} và các món ăn liên quan thành công`
    });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng và item:", error);
    res.status(500).json({ error: "Lỗi khi xóa đơn hàng" });
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
  
