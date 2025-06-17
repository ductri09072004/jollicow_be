import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Carts");
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

//hàm tạo cart
export const addCartRequest = async (req, res) => {
  try {
    const {
      id_dishes,
      id_restaurant,
      id_table,
      id_topping,
      name,
      note,
      price,
      quantity
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !id_dishes || !id_restaurant || !id_table || !Array.isArray(id_topping) ||
      !name || typeof price !== 'number' || typeof quantity !== 'number'
    ) {
      return res.status(400).json({ error: "Thiếu hoặc sai định dạng dữ liệu đầu vào" });
    }

    const newCartRef = database.ref("Carts").push(); // tạo ID tự động

    const newCart = {
      id_dishes,
      id_restaurant,
      id_table,
      id_topping,
      name,
      note: note || "",
      price,
      quantity
    };

    await newCartRef.set(newCart);

    res.status(201).json({ message: "Đã thêm vào giỏ hàng", id: newCartRef.key });
  } catch (error) {
    console.error("Lỗi khi thêm giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi khi thêm giỏ hàng" });
  }
};

//hàm chỉnh sửa price,note,quantity,toppings
export const updateCartRequest = async (req, res) => {
  try {
    const { id } = req.params; // id của mục trong giỏ hàng (Firebase key)
    const { note, price, quantity, id_topping } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID giỏ hàng" });
    }

    const cartRef = database.ref(`Carts/${id}`);
    const snapshot = await cartRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Mục giỏ hàng không tồn tại" });
    }

    const updateFields = {};

    if (typeof note === "string") updateFields.note = note;
    if (typeof price === "number") updateFields.price = price;
    if (typeof quantity === "number") updateFields.quantity = quantity;
    if (Array.isArray(id_topping)) updateFields.id_topping = id_topping;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "Không có trường hợp lệ để cập nhật" });
    }

    await cartRef.update(updateFields);

    res.status(200).json({ message: "Mục giỏ hàng đã được cập nhật" });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật giỏ hàng" });
  }
};

//hàm xóa cart
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Thiếu ID danh mục" });
    }

    const requestRef = database.ref(`Carts/${id}`);
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

//hàm lọc theo id_table và id_restaurant
export const filterCartsByTableAndRestaurant = async (req, res) => {
  try {
    const { id_table, id_restaurant } = req.body;

    if (!id_table || !id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_table hoặc id_restaurant" });
    }

    const cartsRef = database.ref("Carts");
    const snapshot = await cartsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu giỏ hàng" });
    }

    const allCarts = snapshot.val();
    const filteredCarts = [];

    Object.entries(allCarts).forEach(([key, cart]) => {
      if (
        cart.id_table === id_table &&
        cart.id_restaurant === id_restaurant
      ) {
        filteredCarts.push({ id: key, ...cart });
      }
    });

    res.status(200).json({ carts: filteredCarts });
  } catch (error) {
    console.error("Lỗi khi lọc giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi khi lọc giỏ hàng" });
  }
};
