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

//thống kê món
// export const countDishesQuantity = async (req, res) => {
//   try {
//     // Lấy dữ liệu từ OrderItems
//     const orderItemsSnap = await database.ref("OrderItems").once("value");
//     if (!orderItemsSnap.exists()) {
//       return res.status(404).json({ error: "Không có dữ liệu OrderItems" });
//     }

//     // Lấy dữ liệu từ Menus để ánh xạ id_dishes -> name
//     const menusSnap = await database.ref("Menus").once("value");
//     if (!menusSnap.exists()) {
//       return res.status(404).json({ error: "Không có dữ liệu Menus" });
//     }

//     const orderItems = orderItemsSnap.val();
//     const menus = menusSnap.val();

//     // Map id_dishes -> name
//     const dishNameMap = {};
//     Object.values(menus).forEach(menu => {
//       if (menu.id_dishes && menu.name) {
//         dishNameMap[menu.id_dishes] = menu.name;
//       }
//     });

//     // Đếm tổng quantity theo name
//     const dishCounts = {};
//     Object.values(orderItems).forEach(item => {
//       const { id_dishes, quantity } = item;

//       if (!id_dishes || typeof quantity !== "number") return;

//       const name = dishNameMap[id_dishes] || `Không rõ (${id_dishes})`;

//       if (!dishCounts[name]) {
//         dishCounts[name] = 0;
//       }

//       dishCounts[name] += quantity;
//     });

//     res.json({
//       message: "Tổng số lượng món ăn theo tên món",
//       counts: dishCounts
//     });
//   } catch (error) {
//     console.error("Lỗi khi đếm món theo tên:", error);
//     res.status(500).json({ error: "Lỗi khi đếm món theo tên" });
//   }
// };


export const countDishesQuantity = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant trong yêu cầu" });
    }

    // Lấy dữ liệu
    const [orderItemsSnap, menusSnap, ordersSnap] = await Promise.all([
      database.ref("OrderItems").once("value"),
      database.ref("Menus").once("value"),
      database.ref("Orders").once("value")
    ]);

    if (!orderItemsSnap.exists() || !menusSnap.exists() || !ordersSnap.exists()) {
      return res.status(404).json({ error: "Thiếu dữ liệu từ OrderItems, Menus hoặc Orders" });
    }

    const orderItems = orderItemsSnap.val();
    const menus = menusSnap.val();
    const orders = ordersSnap.val();

    // Map: id_dishes => name
    const dishNameMap = {};
    Object.values(menus).forEach(menu => {
      if (menu.id_dishes && menu.name) {
        dishNameMap[menu.id_dishes] = menu.name;
      }
    });

    // Map: id_order => id_restaurant
    const orderRestaurantMap = {};
    Object.values(orders).forEach(order => {
      if (order.id_order && order.id_restaurant) {
        orderRestaurantMap[order.id_order] = order.id_restaurant;
      }
    });

    // Đếm quantity theo tên món, chỉ khi đơn hàng thuộc nhà hàng được yêu cầu
    const dishCounts = {};
    Object.values(orderItems).forEach(item => {
      const { id_order, id_dishes, quantity } = item;

      const resId = orderRestaurantMap[id_order];
      if (!id_dishes || typeof quantity !== "number" || resId !== id_restaurant) return;

      const name = dishNameMap[id_dishes] || `Không rõ (${id_dishes})`;

      if (!dishCounts[name]) {
        dishCounts[name] = 0;
      }

      dishCounts[name] += quantity;
    });

    res.json({
      id_restaurant,
      message: "Tổng số lượng món ăn theo tên món",
      counts: dishCounts
    });
  } catch (error) {
    console.error("Lỗi khi đếm món theo nhà hàng:", error);
    res.status(500).json({ error: "Lỗi khi đếm món theo nhà hàng" });
  }
};

