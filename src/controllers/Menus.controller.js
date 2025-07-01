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
export const addRequest = async (req, res) => {
  try {
    const { 
      id_category,
      image,
      name,
      price,
      restaurant_id
    } = req.body;

    // Kiểm tra các trường bắt buộc (bỏ qua id_dishes và status vì tự sinh)
    if (!id_category || !name || !price || !restaurant_id) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    // Tạo id_dishes dạng "ME" + 1 chữ cái + 4 số
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 chữ số
    const id_dishes = `ME${randomChar}${randomNumber}`;

    const status = true; // Luôn true

    const requestRef = database.ref("Menus").push();
    await requestRef.set({
      id_category,
      id_dishes,
      image: image || "", // Nếu không có thì để rỗng
      name,
      price,
      restaurant_id,
      status
    });

    res.status(201).json({ message: "Món ăn đã được thêm", id: requestRef.key });
  } catch (error) {
    console.error("Lỗi khi thêm món ăn:", error);
    res.status(500).json({ error: "Lỗi khi thêm món ăn" });
  }
};

// xóa danh sách
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Thiếu ID danh mục" });
    }

    const requestRef = database.ref(`Menus/${id}`);
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

// Cập nhật menu
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID giao dịch" });
    }

    const requestRef = database.ref(`Menus/${id}`);
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Giao dịch không tồn tại" });
    }

    // Chỉ cho phép cập nhật các trường này
    const allowedFields = ["id_category","image","name","price","status"];
    const filteredData = {};

    for (const key of allowedFields) {
      if (updatedData.hasOwnProperty(key)) {
        filteredData[key] = updatedData[key];
      }
    }

    // Kiểm tra nếu không có trường nào hợp lệ để cập nhật
    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ error: "Không có trường hợp lệ để cập nhật" });
    }

    await requestRef.update(filteredData);
    res.status(200).json({ message: "Giao dịch đã được cập nhật" });
  } catch (error) {
    console.error("Lỗi khi cập nhật giao dịch:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật giao dịch" });
  }
};

// Lấy món theo ID
export const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID món ăn" });
    }

    const menuRef = database.ref(`Menus/${id}`);
    const snapshot = await menuRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Món ăn không tồn tại" });
    }

    const menuItem = snapshot.val();
    res.status(200).json({ id, ...menuItem });
  } catch (error) {
    console.error("Lỗi khi lấy món ăn theo ID:", error);
    res.status(500).json({ error: "Lỗi server khi lấy món ăn" });
  }
};

//lọc theo id_restaurant ra 1 cụm 3 bảng
export const softbyRes3in1Requests = async (req, res) => {
  const { restaurant_id } = req.body;

  try {
    const menuRef = database.ref("Menus");
    const categoryRef = database.ref("Categories");
    const toppingRef = database.ref("Topping");

    const [menuSnap, categorySnap, toppingSnap] = await Promise.all([
      menuRef.once("value"),
      categoryRef.once("value"),
      toppingRef.once("value")
    ]);

    if (!menuSnap.exists() || !categorySnap.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const menus = menuSnap.val();
    const categories = categorySnap.val();
    const toppings = toppingSnap.exists() ? toppingSnap.val() : {};

    const filteredMenus = [];

    for (const key in menus) {
      const menu = menus[key];

      if (menu.restaurant_id === restaurant_id) {
        // 🔹 Tìm tên danh mục
        let categoryName = "Không rõ";
        for (const catKey in categories) {
          const category = categories[catKey];
          if (category.id_category === menu.id_category) {
            categoryName = category.name;
            break;
          }
        }

        // 🔹 Tìm các topping liên quan (chỉ lấy name_details và options)
        const relatedToppings = [];
        for (const topKey in toppings) {
          const topping = toppings[topKey];
          if (topping.id_dishes === menu.id_dishes) {
            relatedToppings.push({
              name_details: topping.name_details,
              options: topping.options
            });
          }
        }

        filteredMenus.push({
          id: key,
          ...menu,
          category_name: categoryName,
          toppings: relatedToppings
        });
      }
    }

    res.json(filteredMenus);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

//lọc theo id_restaurant
export const softbyResRequests = async (req, res) => {
  const { restaurant_id } = req.body;

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
        menu.restaurant_id === restaurant_id
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



