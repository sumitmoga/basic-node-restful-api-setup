
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all_orders= (req, res, next) => {
    Order.find()
        .select('productId quantity _id')
        .populate('productId', 'name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        productId: doc.productId,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

exports.create_order=(req, res, next) => {
    Product.findById(req.body.productId).exec().then(product => {
        if (!product) {
            res.send(500).json({ message: "Unvalid Product Id" })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            productId: req.body.productId,
            quantity: req.body.quantity
        });

        return order.save();
    }).then(result => {
        res.status(201).json({
            message: "Order Stored",
            order: {
                productId: result.productId,
                quantity: result.quantity,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            }
        })
    })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

exports.get_order_details=(req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('productId quantity _id')
        .exec()
        .then(order => {
            if (order) {
                res.status(200).json({
                    product: order,
                    request: {
                        type: 'GET',
                        url: 'http:localhost:3000/orders'
                    }
                });
            } else {
                res.status(400).json({ message: "Unvalid entry" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};


exports.delete_order=(req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id }).exec().then(result => res.status(200).json({
        message: "Order deleted",
        request: {
            type: 'POST',
            url: 'http:localhost:3000/orders'
        }
    }))
        .catch(err => res.status(500).json({ error: err }));
}
