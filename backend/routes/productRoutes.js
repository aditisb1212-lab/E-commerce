const express =
    require("express");

const router =
    express.Router();

const {
    getProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require(
    "../controllers/productController"
);

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

// =============================
// PRODUCT ROUTES
// =============================

// Get all products
router.get(
    "/",
    getProducts
);

// Get single product
router.get(
    "/:id",
    getSingleProduct
);

// Create product
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createProduct
);

// UPDATE PRODUCT
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);

// Delete product
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

module.exports =
    router;