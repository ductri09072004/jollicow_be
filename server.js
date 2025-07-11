import express, { json } from "express";
import cors from "cors";

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

const app = express();
const PORT = process.env.PORT || 6000;

// Cấu hình trust proxy cho Railway
app.set('trust proxy', true);

// Middleware phân biệt role và kiểm tra IP
app.use(roleFilter);

// Cấu hình CORS cho 2 tài khoản Railway
app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://employee-production-a7ec.up.railway.app',           // BE Railway
      'https://jollicow.up.railway.app/', // FE Railway    // FE Railway (nếu có)                    // Local development
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-Forwarded-For',
    'X-Real-IP',
    'CF-Connecting-IP'
  ]
}));

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

// Start server
app.listen(PORT, () => {
  console.log(`Server jollicow is running on http://localhost:${PORT}`);
});
