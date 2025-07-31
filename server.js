import express, { json } from "express";
import cors from "cors";
import path from "path";

import staffsRoutes from "./src/routes/Staffs.route.js"; 
import categoriesRoutes from "./src/routes/Categories.route.js";
import menusRoutes from "./src/routes/Menus.route.js";
import orderitemsRoutes from "./src/routes/OrderItems.route.js";
import ordersRoutes from "./src/routes/Orders.route.js";
import restaurantsRoutes from "./src/routes/Restaurants.route.js";
import tablesRoutes from "./src/routes/Tables.route.js";
import cartsRoutes from "./src/routes/Carts.route.js";
import toppingsRoutes from "./src/routes/Topping.route.js";
import notifisRoutes from "./src/routes/Notifi.route.js";
import promotionsRoutes from "./src/routes/Promotions.route.js";
import roleFilter from "./src/middleware/roleFilter.js";
import trackRoutes from "./src/routes/Track.route.js";
import vnpayRoutes from "./src/routes/Vnpay.route.js";
import { initPromotionCron, runImmediateCheck } from "./src/cron/promotionCron.js";


const app = express();
const PORT = process.env.PORT || 6000;

// Phục vụ static cho thư mục public
app.use(express.static("public"));

// Cấu hình trust proxy cho Railway
app.set('trust proxy', true);

// Middleware phân biệt role và kiểm tra IP
app.use(roleFilter);

// Middleware
app.use(cors());

app.use(json());

// Routes Staffs (không có middleware kiểm tra IP)
app.use("/api", staffsRoutes);

// Routes khác (có middleware kiểm tra IP)
app.use("/api", categoriesRoutes);
app.use("/api", menusRoutes);
app.use("/api", ordersRoutes);
app.use("/api", restaurantsRoutes);
app.use("/api", tablesRoutes);
app.use("/api", orderitemsRoutes);
app.use("/api", cartsRoutes);
app.use("/api", toppingsRoutes);
app.use("/api", notifisRoutes);
app.use("/api", promotionsRoutes);
app.use("/api", trackRoutes);
app.use("/api", vnpayRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server jollicow is running on http://localhost:${PORT}`);
  
  // Khởi tạo cron job cho promotion
  initPromotionCron();
  
  // Chạy kiểm tra ngay lập tức khi server khởi động (tùy chọn)
  // runImmediateCheck();
});
