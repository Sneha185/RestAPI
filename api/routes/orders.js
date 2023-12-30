const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');

const orderController = require('../controllers/orders');

router.get('/', checkAuth, orderController.order_get_all);

router.post('/', checkAuth, orderController.order_create_order);

router.get('/:orderId', checkAuth, orderController.orders_get_order);

router.delete('/:orderId', checkAuth, orderController.order_delete_order);

module.exports = router;