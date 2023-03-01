const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

app.use("/auth", authRoutes);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(imageRoutes);
app.use(eventRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);

app.use((err, req, res, next) => {
  const { statusCode, message, validationErrors } = err;
  res.status(statusCode || 500).json({ message, validationErrors });
});

// const { generateData, clearData } = require("./util/fakeData");
// generateData();
// clearData();

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://brothershop:1IZiysgtyfNOAdjy@cluster0.9srxm.mongodb.net/brothershop?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3001);
  });
