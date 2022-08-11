const mysql = require('mysql');

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"products"
});

/*
con.connect(function(error){
    if(error) throw error;
    
    con.query("select * from product",function(error,result){
        if(error) throw error;
        console.log(result);
    });
});
*/
module.exports = con;
