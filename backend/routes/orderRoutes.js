const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const orderController = require("../controllers/orderController");

// Create new order (protected)
router.post(
    "/",
    authMiddleware,
    orderController.createOrder
);

// Get all orders (admin protected if needed)
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    orderController.getOrders
);

// Get single order by ID
router.get(
    "/:id",
    authMiddleware,
    orderController.getOrderById
);

// Update order status
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    orderController.updateOrderStatus
);

module.exports = router;