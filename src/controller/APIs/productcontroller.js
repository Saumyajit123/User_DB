const Product = require("../../models/productmodel");
const statuscode = require("../../utils/statuscode");
const uploadImage = require("../../utils/cloudinaryupload");
const deleteImage = require("../../utils/cloudinarydelete");

class ProductController {

  // CREATE PRODUCT:
  async createproduct(req, res) {
    try {
      const { name, description, price, color, size, isDeleted } = req.body;

      const existingProduct = await Product.findOne({
        $or: [{ size: size }, { price: price }],
      });

      // ALL FIELDS REQUIRED CONDITION:
      if (
        !name ||
        !description ||
        !price ||
        !color ||
        !size ||
        isDeleted === undefined
      ) {
        return res.status(statuscode.BAD_REQUEST).json({
          status: false,
          message: "All fields are required",
        });
      }

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

      const newProduct = new Product({
        name,
        description,
        price,
        color,
        size,
        isDeleted,
        image: imageData,
      });

      const data = await newProduct.save();

      if (data) {
        return res.status(statuscode.CREATED).json({
          status: true,
          message: "Product created successfully",
          data: data,
        });
      } else {
        return res.status(statuscode.BAD_REQUEST).json({
          status: false,
          message: "Product creation failed",
          data: null,
        });
      }
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // GET PRODUCT BY ID:
  async getproductById(req, res) {
    try {
      const id = req.params.id;
      const productData = await Product.findById(id);

      if (!productData) {
        return res.status(statuscode.NOT_FOUND).json({
          status: false,
          message: "No product found",
          data: null,
        });
      }

      return res.status(statuscode.OK).json({
        status: true,
        data: productData,
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // GET ALL PRODUCTS:
  async getallProducts(req, res) {
    try {
      const productData = await Product.find();

      if (!productData || productData.length == 0) {
        return res.status(statuscode.NOT_FOUND).json({
          status: false,
          message: "No product found",
          data: null,
        });
      }

      return res.status(statuscode.OK).json({
        status: true,
        total: productData.length,
        message: "All Products found",
        data: productData,
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // UPDATE PRODUCT:
  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const { name, description, color, size, price, isDeleted } = req.body;

      const productData = await Product.findById(id);

      if (!productData) {
        return res.status(statuscode.NOT_FOUND).json({
          status: false,
          message: "No product found",
          data: null,
        });
      }

      let image = productData.image;

      if (req.file) {
        // delete previous image
        if (productData.image.public_id) {
          await deleteImage(productData.image.public_id);
        }

        // upload new image
        const result = await uploadImage(req.file.buffer);

        image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          description,
          color,
          size,
          price,
          isDeleted,
          image,
        },
        { new: true },
      );

      return res.status(statuscode.OK).json({
        status: true,
        message: "Product data updated successfully",
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // DELETE PRODUCT:
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      const productData = await Product.findById(id);

      if (!productData) {
        return res.status(statuscode.NOT_FOUND).json({
          status: false,
          message: "No product found",
        });
      }

      if (productData.image.public_id) {
        await deleteImage(productData.image.public_id);
      }

      const deleteproduct = await Product.findByIdAndDelete(id);

      return res.status(statuscode.OK).json({
        status: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // SODT DELETE PRODUCT:
  async softDeleteProduct(req, res) {
    try {
      const id = req.params.id;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(statuscode.NOT_FOUND).json({
          status: false,
          message: "Product not found",
        });
      }

      if (product.isDeleted) {
        return res.status(statuscode.BAD_REQUEST).json({
          status: false,
          message: "Product is already deleted",
        });
      }

      const softdeleteProduct = await Product.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        { new: true },
      );

      return res.status(statuscode.OK).json({
        status: true,
        message: "Product soft deleted successfully",
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // RESTORE PRODUCT:
  async restoreProduct(req, res) {
    try {
      const id = req.params.id;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(statuscode.NOT_FOUND).json({
          status: false,
          message: "Product not found",
        });
      }

      if (product.isDeleted) {
        return res.status(statuscode.BAD_REQUEST).json({
          status: false,
          message: "Product is already deleted",
        });
      }

      const restoredProduct = await Product.findByIdAndUpdate(
        id,
        {
          isDeleted: false,
        },
        { new: true },
      );

      return res.status(statuscode.OK).json({
        status: true,
        message: "Product restored successfully",
        data: restoredProduct,
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
