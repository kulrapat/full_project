const express = require('express');
const rateLimit = require('express-rate-limit');

const apiLimit = rateLimit({
    windowMs: 1000 * 60 * 3, // 3 minutes
    max: 100,
    message: 'You have exceeded the 100 requests in 3 minutes limit!',
});

const router = express.Router();
const customerController = require('../controllers/customers');
const productController = require('../controllers/products');
const usersController = require('../controllers/users');
const ordersController = require('../controllers/orders');

router.post('/customers', apiLimit, customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);
router.get('/customers/:id', customerController.getCustomer);
router.get('/customers', customerController.getCustomers);

router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/:id', productController.getProduct);
router.get('/products', productController.getProducts);

router.post('/users', usersController.createUsers);
router.put('/users/:id', usersController.updateUsers);
router.delete('/users/:id', usersController.deleteUsers);
router.get('/users/:id', usersController.getUser);
router.get('/users', usersController.getUsers);

router.post('/orders', ordersController.createOrders);
router.put('/orders/:id', ordersController.updateOrders);
router.delete('/orders/:id', ordersController.deleteOrders);
router.get('/orders/:id', ordersController.getOrder);
router.get('/orders', ordersController.getOrders);



module.exports = router;

