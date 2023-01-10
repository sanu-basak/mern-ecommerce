const express = require('express');
const router = express.Router();

const {Category} = require('../modules/category');

//Select all category
router.get('/',async(req,res) => {

    const category = await Category.find();

    if(!category){
        res.status(500).json({
            success : false,
            message : 'Something went wrong'
        });
    }

    res.send(category);

});

//Create Catgory
router.post('/',(req,res) => {
    const category = new Category({
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    })

    category.save().then((categoryCreated) => {
        res.status(201).json(categoryCreated);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//Delete Category
router.delete('/:id',(req,res) => {
    Category.findByIdAndDelete(req.params.id).then((category) => {
        if(!category){
            res.status(404).json({
                success:false,
                message : 'category not found'});
        }else{
            res.status(200).json({
                success : false,
                message : 'Category successfully deleted'
            });
        }

    }).catch((err) => {
          res.status(500).send(err);
    });
});

//Select category by id
router.get('/:id', async (req,res) => {
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(404).json({
            success : false,
            message : "Category not found"
        });
    }else{
        res.status(200).send(category);
    }
}) 

//Update Catgeory
router.put('/:id',async(req,res) => {
     const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name : req.body.name,
            icon : req.body.icon,
            color : req.body.color
        },
        {
            new:true
        }
     )

     if(!category){
        res.status(500).json({
            success : false,
            message : 'Category not found'
        });
     }

     res.status(200).send(category);
});

module.exports = router;
