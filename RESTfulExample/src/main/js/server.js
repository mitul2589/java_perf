var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var url = 'mongodb://localhost/local';
var db = mongoose.connect(url);

var compression = require('compression');
//var morgan = require('morgan');
//app.use(compression());
//app.use(morgan('tiny'));


var expressSession = require('express-session');
var router = express.Router();



// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/dist'));

// define the view engine and set the path for views files

app.engine('html', require('ejs').renderFile);
//Register given template engine callbac function as extension

var Product = require(path.join(__dirname + '/server/models/products'));


//app.use(express.static(__dirname), isAuthenticated);
//app.use(express.static(__dirname + '/dist')); // To access static files under public folder

var Product = require(path.join(__dirname + '/server/models/products'));

app.get('/compute', function (req, res) {
    const array = [];
    for (var i = 2; array.length < 500; i++) {
        var divisorFound = false;  
        for (var count = 2; count < i; count++) {
            divisorFound = false;
            if (i % count === 0) {
                divisorFound = true;
                break;
            }
        }
        
        if (divisorFound == false) {array.push(i);}
    }
    res.end(array + '123');
});

app.get('/dbquery', function (req, res) {
    Product.find({}, (err, products) => {
        res.end(products.toString());
    });
});

app.get('/cruddbquery', function (req, res) {
    Product.find({}, (err, products) => {
        res.end(products.toString());
    });
});


app.listen(3000);