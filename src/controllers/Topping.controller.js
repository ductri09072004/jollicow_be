import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả topping từ Firebase
export const getToppings = async (req, res) => {
  try {
    const toppingRef = database.ref("Topping");
    const snapshot = await toppingRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu Topping" });
    }

    const toppingsData = snapshot.val();

    res.status(200).json(toppingsData);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Topping:", error);
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
  }
};

// Tạo ID Topping: "MD" + randomChar + 4 số
function generateRandomIdTopping() {
  const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 số
  return `MD${randomChar}${randomNumber}`;
}

// Hàm tạo một đối tượng Topping
function buildToppingObject(id_dishes, name_details, options) {
  const id_topping = generateRandomIdTopping();

  const formattedOptions = options.map((opt, index) => ({
    id_option: `${id_topping}_${index + 1}`,
    name: opt.name,
    price: opt.price,
  }));

  return {
    id_dishes,
    id_topping,
    name_details,
    options: formattedOptions,
  };
}

// API tạo topping mới và lưu vào Firebase
export const createTopping = async (req, res) => {
  try {
    const { id_dishes, name_details, options } = req.body;

    if (!id_dishes || !name_details || !options || !Array.isArray(options)) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    const newTopping = buildToppingObject(id_dishes, name_details, options);

    const toppingRef = database.ref("Topping");
    const newToppingRef = toppingRef.push(); // Tạo key mới ngẫu nhiên
    await newToppingRef.set(newTopping);

    res.status(201).json({
      message: "Tạo topping thành công",
      id: newToppingRef.key,
      topping: newTopping,
    });
  } catch (error) {
    console.error("Lỗi khi tạo topping:", error);
    res.status(500).json({ error: "Lỗi server khi tạo topping" });
  }
};


// Lọc topping theo id_dishes (POST)
export const filterToppingsByDishId = async (req, res) => {
  try {
    const { id_dishes } = req.body;

    if (!id_dishes) {
      return res.status(400).json({ error: "Thiếu tham số id_dishes trong body" });
    }

    const toppingRef = database.ref("Topping");
    const snapshot = await toppingRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu Topping" });
    }

    const toppingsData = snapshot.val();

    // Lọc các topping có id_dishes khớp
    const filteredToppings = Object.entries(toppingsData)
      .filter(([_, value]) => value.id_dishes === id_dishes)
      .map(([key, value]) => ({
        id: key,
        ...value
      }));

    if (filteredToppings.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy topping cho món ${id_dishes}` });
    }

    res.status(200).json(filteredToppings);
  } catch (error) {
    console.error("Lỗi khi lọc topping:", error);
    res.status(500).json({ error: "Lỗi server khi lọc topping" });
  }
};


