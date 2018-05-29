var express = require('express');
var path = require('path');
var ProductRouter = express.Router();
var Counter = require(path.join(__dirname + '/../models/counters'));

function getNextSequence(sequenceName, callback) {
    console.log("getNextSequence function called");
    Counter.find({ '_id': 'productId' }, (err, counter) => {
        if (err) {
            console.log("Error -->>>" + err);
        } else {
            console.log("counter -->>>" + counter[0]);
            counter[0].sequence_value += 1;
            counter[0].save((err, result) => {
                callback(null, result.sequence_value);
            });

        }

    });
    //return seq;
};

var productrouter = function (Product) {
    ProductRouter.route('/')
        .get(function (req, res) {
            Product.find({}, (err, products) => {
                res.json(products);
            });
        })
        .post((req, res) => {
            var newproduct = new Product(req.body);
            getNextSequence('productId', (err, seq) => {
                newproduct._id = seq;
                newproduct.save((err, product) => {
                    if (err) {
                        console.log("Error-->" + err);
                    } else {
                        console.log("Product Saved Successfully...!!!");
                        res.json(product);
                    }

                });
            });
        })
        .put((req, res) => {
            Product.find({ '_id': req.body._id }, (err, product) => {
                console.log("Find Product" + product);
                var updatedProduct = new Product(req.body);
                console.log("Find Product" + updatedProduct);
                var body = req.body;
                updatedProduct.update(body, (err, item) => {
                    if (err) {
                        console.log("Product Saving Error" + err);
                    } else {
                        console.log("Saved Successfully..." + item.productName);
                        res.json(item);
                    }
                })
            });
        });

    ProductRouter.route('/:id')
        .delete((req, res) => {
            Product.remove({ '_id': req.params.id }, (err, result) => {
                console.log("result ---->>>>" + result);
                if (err) {
                    console.log("Product Deleting Error" + err);
                } else if (result) {
                    console.log("Deleted Successfully..." + result);
                    res.json("Success");
                } else {
                    console.log("No Result Found...!!!");
                }
            });
        });




    /*
    ProductRouter.get('/', function (req, res) {
        mongoose.connect(url, function (err, db) {
            if (err) {
                console.log("Error");
            } else {
                console.log("Yes, Connected...!!!!");
            }

            Product.count((err, productsCount) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("productsCount" + productsCount);
                }

                Product.find({}, (err, products) => {
                    console.log(products);
                    res.json(products);
                });
            });
        });
    });
    */

    return ProductRouter;
};


module.exports = productrouter;