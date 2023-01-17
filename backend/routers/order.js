const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const router = express.Router();

//Get list of orders
router.get('/', async (req, res) => {
    const order = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

    if (!order) {
        return res.status(404).json({ message: 'No orders found' });
    }

    return res.status(200).json(order);
});

//Get list order by id
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                populate: 'Category'

            }
        });

    if (!order) {
        return res.status(404).json({ message: 'No order found' });
    }

    return res.status(200).json(order);

});

// Order creation
router.post('/', async (req, res) => {
    const orderItemIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            product: orderItem.product,
            quantity: orderItem.quantity
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }));

    const orderItemsIdsResolved = await orderItemIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findOne({ _id: orderItemId }).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));

    const totalPrice = totalPrices.reduce((total, num) => total + num, 0)

    const order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
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

//update order status
router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {
            new: true
        });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' })
    }

    return res.status(200).json(order);
});

//Delete Order
router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async (order) => {
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order is not found'
            })
        } else {
            await order.orderItems.map(async (orderItem) => {
                await OrderItem.findByIdAndDelete(orderItem);
            });

            res.status(202).json({
                message: "Order deleted",
                success: true
            });
        }
    }).catch(err => {
        res.status(500).json({
            success: false,
            message: err
        })
    });

});

//get total sales of orders
router.get('/get/total_sales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: '$totalPrice' }
            }
        }
    ]);

    if (!totalSales) {
        return res.status(404).json({ message: 'No orders found' });
    }

    return res.status(200).json({
        success: true,
        totalSales: totalSales.pop().totalSales
    });

});

//get count of total orders
router.get('/get/total_orders', async (req, res) => {

    const orderCount = await Order.countDocuments();

    if (!orderCount) {
        res.status(500).json({ success: false })
    }

    res.send({
        orderCount: orderCount
    });

});

//get user orders
router.get('/get/user/:id', async (req, res) => {
    const orders = await Order.find({ user: req.params.id }).populate({
        path: 'orderItems',
        populate: {
            path: 'product',
            populate: 'Category'
        }
    });

    if (!orders) {
        return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).send(orders);
});

module.exports = router;