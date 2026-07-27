const User = require("../../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StatusCode = require("../../utils/statusCode");
const uploadImage = require("../../utils/cloudinaryupload");
const deleteImage = require("../../utils/cloudinarydelete");

class AuthController {
  async signup(req, res) {
    // console.log(req.body);

    try {
      const { name, email, phone, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      //Password hashing:
      const salt = 10;
      const hasedPassword = await bcryptjs.hash(password, salt);

      let imageData = {
        url: "",
        public_id: "",
      };

      if (req.file) {
        const result = await uploadImage(req.file.buffer);

        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
      const data = new User({
        name: name,
        email: email,
        phone: phone,
        password: hasedPassword,
        image: imageData,
      });

      const result = await data.save();
      return res.status(StatusCode.OK).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );

      return res.status(StatusCode.BAD_REQUEST).json({
        success: true,
        message: "Login Successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token: token,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findById(id);

      if (!user) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      let image = user.image;

      if (req.file) {
        if (user.image.public_id) {
          await deleteImage(user.image.public_id);
        }

        const result = await uploadImage(req.file.buffer);

        image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          image,
        },
        {
          new: true,
        },
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findById(id);

      if (!user) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.image.public_id) {
        await deleteImage(user.image.public_id);
      }

      await User.findByIdAndDelete(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async dashboard(req, res) {
    try {
      return res.status(StatusCode.OK).json({
        success: true,
        message: "welcome to dashboard",
        user: req.user,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
