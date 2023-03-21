const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const cartController = require("../controllers/cart");

router.put("/cart/add-to-cart", isAuth, cartController.addToCart);

router.put("/cart/update-quantity", isAuth, cartController.updateQuantity);

router.put("/cart/remove-item", isAuth, cartController.removeCartItem);

router.put("/cart/remove-items", isAuth, cartController.removeCartItems);

module.exports = router;
