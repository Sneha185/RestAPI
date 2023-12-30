const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check_auth');
const productController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const productName = req.body.name;
        const originalExtension = file.originalname.split('.').pop();
        const newFilename = `${productName}.${originalExtension}`;
        cb(null, newFilename);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image\\jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });

router.get('/', productController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'),);

router.get('/:productId', productController.products_get_product);

router.patch('/:id', checkAuth, productController.products_update_product);

router.delete('/:productId', checkAuth, productController.products_delete_product);

module.exports = router;