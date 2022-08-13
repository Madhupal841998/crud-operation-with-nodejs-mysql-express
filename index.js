const con = require("./connection");

const express = require('express');
const app = express();

var bodyParser = require('body-parser');
const { response } = require("express");
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const resultsPerPage = 10;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/', (req, res) => {
    var productId = req.body.productId;
    var productName = req.body.productName;
    var categoryName = req.body.categoryName;
    var categoryId = req.body.categoryId;

    var sql = "INSERT INTO product(productId,productName,categoryName,categoryId) VALUES ?";

    var values = [
        [productId, productName, categoryName, categoryId]
    ];

    con.query(sql, [values], (error, result) => {
        if (error) throw error;
        res.redirect('/product');
        // console.log(result);
        //res.send("Registration successfull " + productId);
    });
});




app.get('/product', (req, res) => {
    var sql = 'SELECT * FROM product';
    con.query(sql, (err, result) => {
            const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if(page > numberOfPages){
            res.redirect('/product?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/product?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        var sql = `SELECT * FROM product LIMIT ${startingLimit},${resultsPerPage}`;
        con.query(sql, (err, result)=>{
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            res.render(__dirname +'/product', { product: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

/*
app.get('/product', (req, res) => {

    var sql = "select * from product";

    con.query(sql, (error, result) => {
        if (error)
            throw error;
        // console.log(result);
        res.render(__dirname + "/product.ejs", { product: result });

    });
});
*/

app.get('/delete-product', (req, res) => {

    var sql = "delete from product where productId=?";

    var productId = req.query.productId;

    con.query(sql, [productId], (error, result) => {
        if (error) throw error;
        //console.log(result);
        res.redirect('/product');
    });
});

app.get('/update-product', function (req, res) {
    var sql = "select * from product where productId=?";
    
    var productId = req.query.productId;
    
    con.query(sql, [productId], function (error, result) {
        if (error) console.log(error);
        res.render(__dirname + "/update-product", { product: result });
    });
});

app.post('/update-product', function (req, res) {
    var id = req.body.id;
    var productId = req.body.productId;
    var productName = req.body.productName;
    var categoryName = req.body.categoryName;
    var categoryId = req.body.categoryId;
    
    var sql = " UPDATE product set productId= ?, productName= ? , categoryName= ? , categoryId= ? WHERE id= ? ";

    con.query(sql, [productId, productName, categoryName, categoryId, id], (result) => {
        res.redirect('/product');
    });
});

/*con.connect(function(error){
    if(error) throw error;
    
    con.query("select * from product",function(error,result){
        if(error) throw error;
        console.log(result);

    });
});
*/
app.listen(2000);
