const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const multer = require('multer');
const { default: mongoose } = require('mongoose');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }

        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
})

const upload = multer({ storage: storage })

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
router.post('/', upload.single('image'), (req, res) => {

    const file = req.file;
    if (!file)
        return res.status(400).json({ message: 'No image is found' });

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('Host')}/public/uploads/`;

    console.log(basePath);
    const product = new Product({
        name: req.body.name,
        image: `${basePath}${fileName}`,
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


//Update Product details
router.put('/:id', upload.single('image'), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Product id invalid' });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).json({ message: 'Product category not found' });
    }

    const product = await Product.findById(req.body.id);

    const file = req.file;
    if (!file)
        return res.status(400).json({ message: 'No image is found' });

    let imagepath;

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('Host')}/public/uploads/`;

    if (req.body.image) {
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const productUpdate = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: imagepath
    }, { new: true });

    if (!productUpdate) {
        return res.status(400).json({ message: 'Product not found' });
    };

    res.status(200).json(productUpdate);

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
