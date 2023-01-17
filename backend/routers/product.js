const express = require('express');
const router = express.Router();

const { Product } = require('../models/product');

//Get Product List
router.get('/', async (req, res) => {
    let filter = {};

    if (req.query.categories) {
        filter = { Category: req.query.categories.split(',') }
    }
    const product = await Product.find(filter).populate('Category');

    if (!product) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }

    res.send(product);
});

//Create new product
router.post('/', (req, res) => {

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
        Category: req.body.category,
        description: req.body.description,
        isFeatured: req.body.isFeatured,
        price: req.body.price
    })

    product.save().then((productCreated) => {
        res.status(201).json(productCreated);
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })

});

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if (!productCount) {
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        });
    }

    res.status(200).send({
        count: productCount
    });
});

router.get(`/get/feature/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const featureProduct = await Product.find({
        isFeatured: true
    }).limit(count);

    if (!featureProduct) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }

    res.status(200).send(featureProduct);
})

module.exports = router;
