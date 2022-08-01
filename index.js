const http = require('http');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'temp',
});

//html string that will be send to browser
var reo ='<html><head><title>PlantIOT</title></head><body><h1 style = "color:blue;">Plant IOT Report for Last Updates</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +=
        '</td><td>'+ res[i].temp 
        +'</td><td>'+ res[i].feels_like 
        +'</td><td>'+ res[i].humidity
        +'</td><td>'+ res[i].pressure 
        +'</td><td>'+ res[i].windspeed 
        +'</td><td>'+ res[i].created_at 
        +'</td></tr>';
      }


      table ='<table border="4"><tr></tr>  <th>Temp</th> <th>Feels_Like</th>  <th>Humidity</th>  <th>Pressure</th>  <th>WindSpeed</th> <th>CreatedAt</th>     </tr>'
      
      
      
      + table 
      +'</table>';

      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}


let sql ='SELECT * from Users Order By id Desc Limit 20' ;

//create the server for browser access
const server = http.createServer((req, res)=>{
    setResHtml(sql, resql=>{
      reo = reo.replace('{${table}}', resql);
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      res.write(reo, 'utf-8');
      res.end();
    });
});

server.listen(8080, ()=>{
  console.log('Server running at //localhost:8080/');
});
