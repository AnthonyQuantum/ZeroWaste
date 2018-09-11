const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/zero_waste', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get category title by ID
router.get('/categories/:id', (req, res) => {
    connection((db) => {
        db.collection('categories')
            .find({ id: req.params.id })
            .toArray()
            .then((categories) => {
                response.data = categories;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get products by category ID
router.get('/products/:category', (req, res) => {
    connection((db) => {
        db.collection('products')
            .find({ categoryId: req.params.category })
            .toArray()
            .then((products) => {
                response.data = products;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get all info for products in cart
router.post('/cart', (req, res) => {
    response.data = [];
    connection((db) => {

        var cart = JSON.parse(Object.keys(req.body)[0]).products;
        var leftInCart = cart.length;
        cart.forEach(product => {
            db.collection('products')
            .find({ id: product.id })
            .toArray()
            .then((products) => {
                var thisProduct = {
                    id: products[0].id,
                    title: products[0].title,
                    price: products[0].price,
                    image: products[0].image,
                    quantity: product.quantity
                };
                response.data.push(thisProduct)
                leftInCart--;
                if (leftInCart == 0) 
                    res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        });

    });
});

module.exports = router;