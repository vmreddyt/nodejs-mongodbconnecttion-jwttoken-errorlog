const express = require("express");
const router = express.Router();
var logger = require('winston');
var ObjectID = require('mongodb').ObjectID;


router.get('/createCollection', createCollection);
router.post('/book', createBookDetails);
router.get('/book', getBookDetails);
router.put('/book', updateBookDetails);
router.delete('/book/:id', deleteBookDetails);


function createCollection(req, res) {
    const db = req.app.locals.db;
    db.createCollection("books", function (err, result) {
        if (err) throw err;
    });
}

function createBookDetails(req, res) {
    var Bookname = req.body.bookname;
    var Authorname = req.body.authorname;
    var Price = req.body.price;
    var data = {
        "error": 1,
        "Books": ""
    };
    if (!!Bookname && !!Authorname && !!Price) {

        const collection = req.app.locals.db.collection('books');
        collection.insertOne({ bookname: Bookname, authorname: Authorname, price: Price }, function (err, result) {
            if (!!err) {
                data["Books"] = "Error Adding data";
            } else {
                data["error"] = 0;
                data["Books"] = "Book Added Successfully";
            }
            res.json(data);
        });

    } else {
        data["Books"] = "Please provide all required data (i.e : Bookname, Authorname, Price)";
        res.json(data);
    }
}

function getBookDetails(req, res) {
    var data = {
        "Data": ""
    };
    const collection = req.app.locals.db.collection('books');
    collection.find().toArray(function (err, items) {
        if (items.length != 0) {
            data["error"] = 0;
            data["Books"] = items;
            logger.error(data);

            res.json(data);
        } else {
            data["error"] = 1;
            data["Books"] = 'No books Found..';
            res.json(data);
        }
    });
}

function updateBookDetails(req, res) {
    var Id = req.body.id;
    var Bookname = req.body.bookname;
    var Authorname = req.body.authorname;
    var Price = req.body.price;
    var data = {
        "error":1,
        "Books":""
    };
    if(!!Bookname && !!Authorname && !!Price){
        const collection = req.app.locals.db.collection('books');
        collection.updateOne({_id:ObjectID(Id)}, {$set:{bookname:Bookname,authorname:Authorname,price:Price}}, function(err) {
            if(!!err){
                data["Books"] = "Error Updating data";
                console.log("second");
            }else{
                data["error"] = 0;
                data["Books"] = "Updated Book Successfully";
            }
            res.json(data);
        });
    }else{
        data["Books"] = "Please provide all required data (i.e : Bookname, Authorname, Price)";
        res.json(data);
    }
}

function deleteBookDetails(req, res) {
    var Id = req.params.id;
    var data = {
        "error":1,
        "Books":""
    };
    if(!!Id){
        const collection = req.app.locals.db.collection('books');
        collection.deleteOne({_id:ObjectID(Id)}, function(err, result) {
            if(!!err){
                data["Books"] = "Error deleting data";
            }else{
                data["error"] = 0;
                data["Books"] = "Delete Book Successfully";
            }
            res.json(data);
        });
    }else{
        data["Books"] = "Please provide all required data (i.e : id )";
        res.json(data);
    }
}

module.exports = router;