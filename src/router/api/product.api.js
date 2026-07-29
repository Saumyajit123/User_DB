const express = require("express");
const ProductController = require("../../controller/APIs/productcontroller");
const cloudupload = require("../../middleware/cloudmulter");
const AuthMiddleware = require("../../middleware/authMiddleware");
const Validation = require("../../validate/index");
const productSchemaValidation = require("../../validate/productSchema");
const router = express.Router();

router.get(
  "/products",
  AuthMiddleware.verifyToken,
  ProductController.getallProducts,
);

router.get(
  "/product/:id",
  AuthMiddleware.verifyToken,
  ProductController.getproductById,
);

router.patch(
  "/product/restore/:id",
  AuthMiddleware.verifyToken,
  ProductController.restoreProduct,
);

// For Cloudinary:
router.post(
  "/create-product",
  AuthMiddleware.verifyToken,
  Validation.validate(productSchemaValidation.createProduct),
  cloudupload.single("image"),
  ProductController.createproduct,
);
router.put(
  "/product/update/:id",
  AuthMiddleware.verifyToken,
  Validation.validate(productSchemaValidation.updateProduct),
  cloudupload.single("image"),
  ProductController.updateProduct,
);
router.delete(
  "/product/delete/:id",
  AuthMiddleware.verifyToken,
  ProductController.deleteProduct,
);
router.delete(
  "/product/softdelete/:id",
  AuthMiddleware.verifyToken,
  ProductController.softDeleteProduct,
);

module.exports = router;
