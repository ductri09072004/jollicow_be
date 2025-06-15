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

//delete cả 1 nhóm topping
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Thiếu ID danh mục" });
    }

    const requestRef = database.ref(`Topping/${id}`);
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

//cập nhật name detail
export const updateNameDetailRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID giao dịch" });
    }

    const requestRef = database.ref(`Topping/${id}`);
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Giao dịch không tồn tại" });
    }

    // Chỉ cho phép cập nhật các trường này
    const allowedFields = ["name_details"];
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

//delete 1 option trong nhóm topping
export const deleteOptionRequest = async (req, res) => {
  try {
    const { id } = req.params; // id của topping (vd: -OIu7ozAaJquVrCr1E0p)
    const { id_option } = req.body; // id_option của option cần xoá

    if (!id || !id_option) {
      return res.status(400).json({ error: "Thiếu ID danh mục hoặc ID option" });
    }

    const requestRef = database.ref(`Topping/${id}`);
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    const data = snapshot.val();
    const existingOptions = data.options || [];

    // Kiểm tra xem option có tồn tại không
    const filteredOptions = existingOptions.filter(opt => opt.id_option !== id_option);
    if (filteredOptions.length === existingOptions.length) {
      return res.status(404).json({ error: "Không tìm thấy option cần xoá" });
    }

    // Cập nhật lại options sau khi xoá
    await requestRef.update({ options: filteredOptions });

    res.status(200).json({ message: "Option đã được xoá thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá option:", error);
    res.status(500).json({ error: "Lỗi khi xoá option" });
  }
};

//chỉnh sửa 1 option
export const updateOptionRequest = async (req, res) => {
  try {
    const { id } = req.params; // id của topping (vd: -OIu7ozAaJquVrCr1E0p)
    const { id_option, name, price } = req.body;

    if (!id || !id_option) {
      return res.status(400).json({ error: "Thiếu ID danh mục hoặc ID option" });
    }

    const requestRef = database.ref(`Topping/${id}`);
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    const data = snapshot.val();
    const existingOptions = data.options || [];

    let optionFound = false;

    const updatedOptions = existingOptions.map(opt => {
      if (opt.id_option === id_option) {
        optionFound = true;
        return {
          ...opt,
          name: typeof name === 'string' ? name : opt.name,
          price: typeof price === 'number' ? price : opt.price,
        };
      }
      return opt;
    });

    if (!optionFound) {
      return res.status(404).json({ error: "Không tìm thấy option cần cập nhật" });
    }

    await requestRef.update({ options: updatedOptions });

    res.status(200).json({ message: "Option đã được cập nhật thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật option:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật option" });
  }
};


