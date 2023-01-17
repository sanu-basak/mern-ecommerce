const { Order } = require('../modules/order');
const { OrderItem } = require('../modules/order-item');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const order = new Order({
        orderItems: req.body.orderItem,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress1,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalprice,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered
    });

    order.save().then((orderCreated) => {
        res.status(200).send(orderCreated);
    }).catch((err) => {
        res.status(500).json({
            sucess: false,
            message: 'Order is not created'
        });
    });


});

module.exports = router;