const express = require("express");
const router = express.Router();
const Validation = require("../../validate/index");
const UserSchemaValidation = require("../../validate/userSchema");
const authController = require("../../controller/APIs/authController");
const AuthMiddleware = require("../../middleware/authMiddleware");
const cloudinaryupload = require("../../middleware/cloudmulter");

router.post(
  "/signup",
  cloudinaryupload.single("image"),
  Validation.validate(UserSchemaValidation.signup),
  authController.signup,
);
router.post(
  "/login",
  Validation.validate(UserSchemaValidation.login),
  authController.login,
);

router.put(
  "/user/update/:id",
  cloudinaryupload.single("image"),
  authController.updateUser,
);

router.delete("/user/delete/:id", authController.deleteUser);
router.get("/dashboard", AuthMiddleware.verifyToken, authController.dashboard);

module.exports = router;
