import cron from 'node-cron';
import { database } from "../data/firebaseConfig.js";

// Hàm tự động cập nhật trạng thái promotion (số lượng = 0 hoặc quá hạn)
const autoUpdatePromotionStatus = async () => {
  try {
    console.log('🕐 Bắt đầu kiểm tra và cập nhật promotion tự động...');
    
    const promotionsRef = database.ref("Promotions");
    const snapshot = await promotionsRef.once("value");

    if (!snapshot.exists()) {
      console.log('❌ Không có dữ liệu promotion để kiểm tra');
      return;
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
        console.log(`📦 Promotion ${promotion.id_promotion}: Hết số lượng`);
      }

      // Kiểm tra ngày hết hạn
      if (promotion.date_end) {
        const endDate = new Date(promotion.date_end);
        if (endDate < now && promotion.status !== "inactive") {
          updateData.status = "inactive";
          needsUpdate = true;
          console.log(`⏰ Promotion ${promotion.id_promotion}: Đã hết hạn`);
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
      console.log(`✅ Đã tự động cập nhật ${updatedCount} promotion`);
    } else {
      console.log('✅ Không có promotion nào cần cập nhật');
    }

    console.log(`📊 Tổng số promotion: ${Object.keys(promotions).length}`);

  } catch (error) {
    console.error('❌ Lỗi khi tự động cập nhật promotion:', error);
  }
};

// Khởi tạo cron job - chạy mỗi ngày lúc 00:00 (nửa đêm)
const initPromotionCron = () => {
  // Cron pattern: '0 0 * * *' = chạy lúc 00:00 mỗi ngày
  cron.schedule('0 0 * * *', () => {
    console.log('🚀 Cron job: Tự động cập nhật promotion hàng ngày');
    autoUpdatePromotionStatus();
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh" // Múi giờ Việt Nam
  });

  console.log('⏰ Cron job promotion đã được khởi tạo - chạy mỗi ngày lúc 00:00');
};

// Hàm chạy ngay lập tức khi khởi động server (tùy chọn)
const runImmediateCheck = () => {
  console.log('🔍 Chạy kiểm tra promotion ngay lập tức...');
  autoUpdatePromotionStatus();
};

export { initPromotionCron, autoUpdatePromotionStatus, runImmediateCheck }; 