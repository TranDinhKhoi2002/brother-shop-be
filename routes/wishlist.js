const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const wishlistController = require("../controllers/wishlist");

router.post("/wishlist/add", isAuth, wishlistController.addToWishlist);

router.post("/wishlist/remove", isAuth, wishlistController.removeFromWishlist);

module.exports = router;
