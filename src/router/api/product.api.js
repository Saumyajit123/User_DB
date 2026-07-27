const express = require('express');
const ProductController = require('../../controller/APIs/productcontroller');
const cloudupload = require('../../middleware/cloudmulter');
const router = express.Router();


router.get('/products', ProductController.getallProducts);

// For Cloudinary:
router.post('/create-product', cloudupload.single("image"), ProductController.createproduct);
router.put('/product/update/:id', cloudupload.single("image"), ProductController.updateProduct);
router.delete('/product/delete/:id',ProductController.deleteProduct);
router.delete('/product/softdelete/:id',ProductController.softDeleteProduct);





module.exports = router;
