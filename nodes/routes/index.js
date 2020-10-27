var express=require('express');
var router=express.Router();

//mariadb dbconn
const mariadb=require('mariadb/callback');
const conn=mariadb.createConnection({
     host:'172.20.0.3',
     user:'root',
     password:'changeMe'
});

let aDate;

conn.connect(err => {
  if (err) {
    console.log("DB connection error: " + err);
  } else {
    console.log("Connected to DB with connection id: " + conn.threadId);
  }
});

conn.query("CREATE DATABASE IF NOT EXISTS testDB",(err)=>{
  if(err){
    console.log(err);
  }
});

conn.query("USE testDB",(err)=>{
  if(err){
    console.log(err);
  }
});

conn.query("CREATE TABLE IF NOT EXISTS testTable(id INT AUTO_INCREMENT PRIMARY KEY,dt DATETIME)",(err)=>{
  if(err){
    console.log(err);
  }
});

conn.query("INSERT INTO testTable(dt) VALUES(NOW())",(err)=>{
  if(err){
    console.log(err);
  }
});

conn.query("SELECT * FROM testTable ORDER BY id DESC LIMIT 1",(err,res)=>{
  if(err){
    console.log(err);
  }else{
    console.log("test");
    console.log(res[0]);
    aDate=res[0]["dt"];
  }
});

//conn.end();
/*
pool.getConnection().then(conn=>{
      conn.query("CREATE DATABASE IF NOT EXISTS testDB")
        .then((rows)=>{

          return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        })
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err);
          conn.end();
        })

    }).catch(err => {
      //not connected
    });

async function asyncFunction(){
  let conn;
  try{
    conn=await pool.getConnection();
    await conn.query("CREATE DATABASE IF NOT EXISTS testDB");
    await conn.query("USE testDB");
    await conn.query("CREATE TABLE IF NOT EXISTS testTable(id INT AUTO_INCREMENT PRIMARY KEY,dt DATETIME)");
    await conn.query("INSERT INTO testTable(dt) VALUES(NOW())");
    const rows=await conn.query("SELECT * FROM testTable ORDER BY id DESC LIMIT 1");
    res.json(rows);
  }catch (err){
    console.log(err);
    throw err;
  }finally{
    if (conn){
      aDate=rows;
      return rows;
    }
  }
}*/

/* GET home page. */
router.get('/',function(req,res,next){
  console.log(aDate);
  res.render('index',{title:'Express',date:aDate});
});

module.exports=router;
