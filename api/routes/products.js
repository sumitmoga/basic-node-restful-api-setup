const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth=require('../middleware/check-auth');
const productController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // To accept the file pass `true`, like so:
        cb(null, true)
    }
    else {
        // To reject this file pass `false`, like so:
        cb(null, false)
    }
}

const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 5
        }
    })

// Handle all request for /products
router.get('/', productController.get_all_products);
router.post('/', upload.single('productImage'),checkAuth, productController.add_products)
router.get('/:productId', productController.get_product_details)
router.patch('/:productId', productController.edit_products)
router.delete('/:productId',checkAuth, productController.delete_product)

module.exports = router;