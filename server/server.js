const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); // Import morgan untuk logging
const helmet = require("helmet"); // Import helmet untuk keamanan

const productRoute = require("./routes/ProductRoutes");
const userAuthRoute = require("./routes/UserAuthRoutes");
const cartUserRoute = require("./routes/CartRoutes");
const addressRoute = require("./routes/AddressRoutes");
const storeProfileRoute = require("./routes/StoreProfileRoutes");
const orderRoute = require("./routes/OrderRoutes");

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

connectDb();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev")); // Use morgan for logging HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use product routes
app.use("/api", productRoute);
app.use("/api/user", userAuthRoute);
app.use("/api/cart", cartUserRoute);
app.use("/api/address", addressRoute);
app.use("/api/store-profile", storeProfileRoute)
app.use("/api/order", orderRoute)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
