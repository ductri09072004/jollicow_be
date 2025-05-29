import express, { json } from "express";
import cors from "cors";

import staffsRoutes from "./src/routes/Staffs.route.js"; 
import categoriesRoutes from "./src/routes/Categories.route.js";
import menusRoutes from "./src/routes/Menus.route.js";
import orderitemsRoutes from "./src/routes/OrderItems.route.js";
import ordersRoutes from "./src/routes/Orders.route.js";
import restaurantsRoutes from "./src/routes/Restaurants.route.js";
import tablesRoutes from "./src/routes/Tables.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use("/api", staffsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", menusRoutes);
app.use("/api", ordersRoutes);
app.use("/api", restaurantsRoutes);
app.use("/api", tablesRoutes);
app.use("/api", orderitemsRoutes);

// Start server
app.listen(PORT, () => {
  // Log sẽ thông báo đúng cổng, nhưng không cần localhost trong môi trường đám mây
  console.log(`Server is running on http://localhost:${PORT}`);
});
