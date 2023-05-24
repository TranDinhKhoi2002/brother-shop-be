const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

dotenv.config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const imageRoutes = require("./routes/image");
const eventRoutes = require("./routes/event");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");
const dataRoutes = require("./routes/data");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const customerRoutes = require("./routes/customer");
const staffRoutes = require("./routes/staff");
const receiptRoutes = require("./routes/receipt");

app.use("/auth", authRoutes);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(imageRoutes);
app.use(eventRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);
app.use(dataRoutes);
app.use(cartRoutes);
app.use(wishlistRoutes);
app.use(customerRoutes);
app.use(staffRoutes);
app.use(receiptRoutes);

app.use((err, req, res, next) => {
  const { statusCode, message, validationErrors } = err;
  res.status(statusCode || 500).json({ message, validationErrors });
});

const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.9srxm.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URL).then(() => {
  app.listen(3001);
});
