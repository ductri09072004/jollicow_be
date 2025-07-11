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

// Cấu hình trust proxy chi tiết cho Railway
app.set('trust proxy', 1); // Tin tưởng 1 proxy level
app.set('trust proxy', 'loopback'); // Tin tưởng loopback addresses
app.set('trust proxy', 'linklocal'); // Tin tưởng link-local addresses
app.set('trust proxy', 'uniquelocal'); // Tin tưởng unique local addresses

// Cấu hình CORS chi tiết cho Railway
app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://jollicow.up.railway.app',
      'https://jollicowfe-production.up.railway.app'
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
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Body parser middleware
app.use(json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware phân biệt role và kiểm tra IP
app.use(roleFilter);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS: Origin not allowed' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server jollicow is running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Trust proxy enabled');
});
