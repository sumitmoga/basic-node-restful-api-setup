
const mongoose = require('mongoose');
const Product = require('../models/product');



exports.get_all_products=(req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
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

exports.add_products= (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        res.status(201).json({
            message: "Product created successfully",
            createdProduect: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

exports.get_product_details=(req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http:localhost:3000/products'
                    }
                });
            } else {
                res.status(400).json({ message: "Unvalid entry" });
            }

        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

exports.edit_products=(req, res, next) => {
    const id = req.params.productId;
    const updateObj = {};
    for (const obj of req.body) {
        updateObj[obj.propName] = obj.value;
    }
    Product.update({ _id: id }, { $set: updateObj })
        .exec()
        .then(result => res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        }))
        .catch(err => res.status(500).json({ error: err }));
};

exports.delete_product=(req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then(result => res.status(200).json({
        message: "Product deleted",
        request: {
            type: 'POST',
            url: 'http:localhost:3000/products'
        }
    }))
        .catch(err => res.status(500).json({ error: err }));
}