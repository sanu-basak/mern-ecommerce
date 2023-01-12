const moongose = require('mongoose');
const orderItemSchema = moongose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

exports.OrderItem = moongose.model('OrderItem', orderItemSchema);