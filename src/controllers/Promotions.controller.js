import { database } from "../data/firebaseConfig.js";

// Lấy danh sách tất cả requests từ Firebase
export const getRequests = async (req, res) => {
  try {
    const requestRef = database.ref("Promotions");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const data = snapshot.val();
    const updatedData = {};

    for (const key in data) {
      const promo = data[key];
      const { percent, max_discount, min_order_value } = promo;

      updatedData[key] = {
        ...promo,
        title: `Giảm ${percent}% Giảm tối đa ${max_discount.toLocaleString("vi-VN")}₫`,
        title_sub: `Đơn tối thiểu ${min_order_value.toLocaleString("vi-VN")}₫`
      };
    }

    res.json(updatedData);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

//lọc theo id_restaurant
export const getPromotionsByRestaurant = async (req, res) => {
  try {
    const { id_restaurant } = req.body;

    if (!id_restaurant) {
      return res.status(400).json({ error: "Thiếu id_restaurant" });
    }

    const requestRef = database.ref("Promotions");
    const snapshot = await requestRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu" });
    }

    const data = snapshot.val();
    const filteredPromotions = {};

    for (const key in data) {
      const promo = data[key];

      if (promo.id_restaurant === id_restaurant) {
        const { percent, max_discount, min_order_value } = promo;

        filteredPromotions[key] = {
          ...promo,
          title: `Giảm ${percent}% Giảm tối đa ${max_discount.toLocaleString("vi-VN")}₫`,
          title_sub: `Đơn tối thiểu ${min_order_value.toLocaleString("vi-VN")}₫`
        };
      }
    }

    res.json(filteredPromotions);
  } catch (error) {
    console.error("Lỗi khi lọc dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lọc dữ liệu" });
  }
};

//hàm cập nhật 
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID của promotion" });
    }

    const ref = database.ref(`Promotions/${id}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không tìm thấy promotion" });
    }

    // Lấy dữ liệu hiện tại và loại bỏ các trường không được phép cập nhật
    const currentData = snapshot.val();
    const { id_promotion, id_restaurant, ...allowedFields } = updatedFields;

    // Kiểm tra nếu có trường không được phép cập nhật
    if (id_promotion !== undefined) {
      return res.status(400).json({ error: "Không được phép cập nhật id_promotion" });
    }

    if (id_restaurant !== undefined) {
      return res.status(400).json({ error: "Không được phép cập nhật id_restaurant" });
    }

    // Nếu quantity = 0 thì status chuyển thành 'inactive'
    if (allowedFields.quantity === 0) {
      allowedFields.status = "inactive";
    }

    // Kiểm tra nếu không có trường nào hợp lệ để cập nhật
    if (Object.keys(allowedFields).length === 0) {
      return res.status(400).json({ error: "Không có trường hợp lệ để cập nhật" });
    }

    await ref.update(allowedFields);

    res.json({ message: "Cập nhật promotion thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật promotion:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật promotion" });
  }
};

//hàm tạo
export const addPromotion = async (req, res) => {
  try {
    const {
      id_restaurant,
      percent,
      max_discount,
      min_order_value,
      quantity,
      date_end,
      status
    } = req.body;

    // Kiểm tra đầu vào bắt buộc
    if (
      !id_restaurant ||
      percent == null ||
      max_discount == null ||
      min_order_value == null ||
      quantity == null ||
      !date_end
    ) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra ngày kết thúc
    const now = new Date();
    const endDate = new Date(date_end);
    const diffInMs = endDate - now;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (isNaN(endDate.getTime()) || diffInDays < 3) {
      return res
        .status(400)
        .json({ error: "Ngày kết thúc phải lớn hơn hiện tại ít nhất 3 ngày" });
    }

    // Kiểm tra logic số lượng
    if (quantity < 0) {
      return res
        .status(400)
        .json({ error: "Số lượng không được âm" });
    }

    // Kiểm tra phần trăm
    if (percent <= 0 || percent > 100) {
      return res
        .status(400)
        .json({ error: "Phần trăm giảm giá phải nằm trong khoảng (0, 100]" });
    }

    // Kiểm tra giá trị đơn tối thiểu
    if (min_order_value <= 0) {
      return res
        .status(400)
        .json({ error: "Giá trị đơn tối thiểu phải lớn hơn 0" });
    }

    // Kiểm tra giảm giá tối đa hợp lý
    const estimatedDiscount = (min_order_value * percent) / 100;
    if (max_discount > estimatedDiscount * 10) {
      return res.status(400).json({
        error: `Giảm tối đa quá lớn so với phần trăm và đơn tối thiểu (gợi ý nên ≤ ${Math.round(
          estimatedDiscount * 10
        )}₫)`
      });
    }

    // Sinh id_promotion: PRO + A-Z + 4 chữ số
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const id_promotion = `PRO${randomChar}${randomDigits}`;

    // Gán status hợp lệ
    let statusValue = status ?? "active";
    if (quantity === 0) {
      statusValue = "inactive";
    }

    // Lưu vào database
    const newPromotionRef = database.ref("Promotions").push();
    const newPromotion = {
      id_promotion,
      id_restaurant,
      percent,
      max_discount,
      min_order_value,
      quantity,
      date_end,
      status: statusValue
    };

    await newPromotionRef.set(newPromotion);

    res.status(201).json({
      message: "Tạo promotion thành công",
      id: newPromotionRef.key,
      ...newPromotion
    });
  } catch (error) {
    console.error("Lỗi khi tạo promotion:", error);
    res.status(500).json({ error: "Lỗi khi tạo promotion" });
  }
};

//hàm xóa promotion
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID của promotion" });
    }

    const ref = database.ref(`Promotions/${id}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không tìm thấy promotion cần xóa" });
    }

    await ref.remove();

    res.json({ message: "Xóa promotion thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa promotion:", error);
    res.status(500).json({ error: "Lỗi khi xóa promotion" });
  }
};

//hàm tính giá tiền được giảm dựa trên giá tổng
export const calculateDiscountFromPromotion = async (req, res) => {
  try {
    const { totalPrice, id_promotion } = req.body;

    if (!totalPrice || !id_promotion) {
      return res.status(400).json({ error: "Thiếu totalPrice hoặc id_promotion" });
    }

    // Tìm promotion có id_promotion tương ứng
    const promotionsRef = database.ref("Promotions");
    const snapshot = await promotionsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có promotion nào trong hệ thống" });
    }

    const promotions = snapshot.val();
    let matchedPromotion = null;

    for (const key in promotions) {
      if (promotions[key].id_promotion === id_promotion) {
        matchedPromotion = promotions[key];
        break;
      }
    }

    if (!matchedPromotion) {
      return res.status(404).json({ error: "Không tìm thấy promotion với id đã cho" });
    }

    // Kiểm tra điều kiện áp dụng
    const {
      percent,
      max_discount,
      min_order_value,
      status,
      quantity
    } = matchedPromotion;

    if (status !== "active") {
      return res.status(400).json({ error: "Promotion không còn hoạt động" });
    }

    if (quantity === 0) {
      return res.status(400).json({ error: "Promotion đã hết lượt sử dụng" });
    }

    if (totalPrice < min_order_value) {
      return res.status(400).json({
        error: `Đơn hàng chưa đạt mức tối thiểu để áp dụng khuyến mãi: ${min_order_value.toLocaleString("vi-VN")}₫`
      });
    }

    // Tính số tiền được giảm
    const discount = Math.min((totalPrice * percent) / 100, max_discount);

    res.json({
      message: "Áp dụng khuyến mãi thành công",
      discount: Math.floor(discount),
      totalAfterDiscount: totalPrice - Math.floor(discount)
    });
  } catch (error) {
    console.error("Lỗi khi tính giảm giá:", error);
    res.status(500).json({ error: "Lỗi khi tính giảm giá" });
  }
};

// Hàm tự động cập nhật trạng thái promotion (số lượng = 0 hoặc quá hạn)
export const autoUpdatePromotionStatus = async (req, res) => {
  try {
    const promotionsRef = database.ref("Promotions");
    const snapshot = await promotionsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Không có dữ liệu promotion" });
    }

    const promotions = snapshot.val();
    const now = new Date();
    let updatedCount = 0;
    const updatePromises = [];

    for (const key in promotions) {
      const promotion = promotions[key];
      let needsUpdate = false;
      const updateData = {};

      // Kiểm tra số lượng
      if (promotion.quantity === 0 && promotion.status !== "inactive") {
        updateData.status = "inactive";
        needsUpdate = true;
      }

      // Kiểm tra ngày hết hạn
      if (promotion.date_end) {
        const endDate = new Date(promotion.date_end);
        if (endDate < now && promotion.status !== "inactive") {
          updateData.status = "inactive";
          needsUpdate = true;
        }
      }

      // Cập nhật nếu cần
      if (needsUpdate) {
        updatePromises.push(
          promotionsRef.child(key).update(updateData)
        );
        updatedCount++;
      }
    }

    // Thực hiện tất cả các cập nhật
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    res.json({
      message: `Đã tự động cập nhật ${updatedCount} promotion`,
      updatedCount,
      totalPromotions: Object.keys(promotions).length
    });

  } catch (error) {
    console.error("Lỗi khi tự động cập nhật promotion:", error);
    res.status(500).json({ error: "Lỗi khi tự động cập nhật promotion" });
  }
};

