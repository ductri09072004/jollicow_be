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
        order.status_order === status_order &&
        order.payment === 'Đã thanh toán'
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

//loc để từ đơn lấy ra món, sl, topping, ghi chú
export const filter3in1Requests = async (req, res) => {
  try {
    const { id_restaurant, status_order } = req.body;

    if (!id_restaurant || !status_order) {
      return res.status(400).json({ error: "Thiếu id_restaurant hoặc status_order trong body" });
    }

    // Lấy Orders
    const ordersSnapshot = await database.ref("Orders").once("value");
    if (!ordersSnapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu Orders" });
    }
    const allOrders = ordersSnapshot.val();

    const filteredOrders = {};

    for (const key of Object.keys(allOrders)) {
      const order = allOrders[key];
      if (
        order.id_restaurant === id_restaurant &&
        order.status_order === status_order
      ) {
        filteredOrders[key] = {
          status_order: order.status_order || "",
          id_table: order.id_table || "",
          date_create: order.date_create || "",
          id_order: order.id_order,
          items: []
        };
      }
    }

    if (Object.keys(filteredOrders).length === 0) {
      return res.status(200).json({});
    }

    // Lấy OrderItems
    const orderItemsSnapshot = await database.ref("OrderItems").once("value");
    const allItems = orderItemsSnapshot.exists() ? orderItemsSnapshot.val() : {};

    // Lấy Menus
    const menusSnapshot = await database.ref("Menus").once("value");
    const allMenus = menusSnapshot.exists() ? menusSnapshot.val() : {};

    const dishNameMap = {};
    for (const menuKey in allMenus) {
      const menuItem = allMenus[menuKey];
      if (menuItem.id_dishes && menuItem.name) {
        dishNameMap[menuItem.id_dishes] = menuItem.name;
      }
    }

    // Lấy Topping và tạo map từ id_option → name
    const toppingSnapshot = await database.ref("Topping").once("value");
    const allToppings = toppingSnapshot.exists() ? toppingSnapshot.val() : {};

    const toppingOptionMap = {}; // id_option -> name
    for (const toppingId in allToppings) {
      const topping = allToppings[toppingId];
      if (Array.isArray(topping.options)) {
        topping.options.forEach(option => {
          if (option.id_option && option.name) {
            toppingOptionMap[option.id_option] = option.name;
          }
        });
      }
    }

    // Gắn items vào từng order, thay id_dishes và id_topping bằng tên
  // Gắn items vào từng order, thay id_dishes và id_topping bằng tên (nhiều topping)
for (const itemKey of Object.keys(allItems)) {
  const item = allItems[itemKey];
  for (const orderKey of Object.keys(filteredOrders)) {
    if (filteredOrders[orderKey].id_order === item.id_order) {
      // Nếu id_topping là mảng → chuyển từng id_option thành tên topping
      let toppingNames = [];

      if (Array.isArray(item.id_topping)) {
        toppingNames = item.id_topping.map(
          (id) => toppingOptionMap[id] || id
        );
      } else if (typeof item.id_topping === "string") {
        // Trường hợp chỉ có 1 topping dạng string
        toppingNames = [toppingOptionMap[item.id_topping] || item.id_topping];
      }

      filteredOrders[orderKey].items.push({
        name_topping: toppingNames,
        note: item.note || "",
        quantity: item.quantity || 0,
        id_dishes: dishNameMap[item.id_dishes] || item.id_dishes || ""
      });
    }
  }
}

    res.json(filteredOrders);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

//lọc theo res+status(confirmed và closed)
export const softByResDoneRequests = async (req, res) => {
  const { id_restaurant } = req.body;

  try {
    const requestRef = database.ref("Orders");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const menus = snapshot.val();
    const filteredMenus = [];

    // Lọc các menu theo id_category và status_order phù hợp
    for (const key in menus) {
      const menu = menus[key];
      if (
        menu.id_restaurant === id_restaurant &&
        (menu.status_order === "confirmed" || menu.status_order === "closed" || menu.status_order === "cancelled")
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

//hàm tính tổng doanh thu theo tháng
export const calculateMonthlyRevenueByRestaurant = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant trong yêu cầu" });
    }

    const ordersRef = database.ref("Orders");
    const snapshot = await ordersRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu đơn hàng" });
    }

    const orders = snapshot.val();
    const monthlyRevenue = {};

    Object.values(orders).forEach(order => {
      const { id_restaurant: resId, total_price, date_create } = order;

      if (!resId || resId !== id_restaurant || !total_price || !date_create) return;

      const date = new Date(date_create);
      if (isNaN(date)) return;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0;
      }

      monthlyRevenue[monthKey] += total_price;
    });

    res.json({ id_restaurant, monthlyRevenue });
  } catch (error) {
    console.error("Lỗi khi tính doanh thu theo nhà hàng:", error);
    res.status(500).json({ error: "Lỗi khi tính doanh thu" });
  }
};

//đếm đơn
export const countOrdersByStatus = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant trong yêu cầu" });
    }

    const ordersRef = database.ref("Orders");
    const snapshot = await ordersRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu đơn hàng" });
    }

    const orders = snapshot.val();

    const counts = {
      pending: 0,
      preparing: 0,
      confirmed: 0,
      closed: 0,
      cancelled: 0,
      total: 0
    };

    Object.values(orders).forEach(order => {
      const { id_restaurant: resId, status_order } = order;

      if (resId === id_restaurant) {
        counts.total++;

        // Nếu status_order thuộc các trạng thái hợp lệ thì tăng
        if (counts.hasOwnProperty(status_order)) {
          counts[status_order]++;
        }
      }
    });

    res.json({
      id_restaurant,
      counts
    });
  } catch (error) {
    console.error("Lỗi khi đếm đơn hàng theo trạng thái:", error);
    res.status(500).json({ error: "Lỗi khi đếm đơn hàng" });
  }
};









  
