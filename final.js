const axios = require('axios');
const fetch = require("node-fetch");
var express = require("express");
const {Sequelize, DataTypes, Model} = require('sequelize');
const res = require('express/lib/response');
const sequelize = new Sequelize('sensors', 'root', '', {
  host: 'localhost',
  dialect: `mysql`,
});
const app = express();

try{
  sequelize.authenticate();
 console.log('Connection established successfully')

} catch(error) {
 console.error('Unable to connect to the database: ', error);
}

class Moisture extends Model {}
Moisture.init({
 
    Moisture: {
        type: Sequelize.STRING
        },
    
    
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt',
      },

    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
      },  
}
,
{
    sequelize, modelName: 'Moisture'
});


//loggin in
function uploadData () {
  axios({
    method: 'post',
    url: 'https://platform.sensenuts-ei.com:4000/login',
    data: {
        "uname": "IP_Delhi", 
        "pass": "IP_Delhi@12345"
    },
    withCredentials: true
  })
  .then((response) => {
    console.log(response)
   // console.log(response.headers["set-cookie"][0].split(';')[0]);
    cookie = response.headers["set-cookie"][0].split(';')[0];

    let moisture_url = "https://platform.sensenuts-ei.com:4000/assetOne.json/606fc3ea0f119f26ed97c0c1";

//moisture sensor
let settings = { method: "Get" , 
  credentials: 'include',
    headers: {
      "Content-type": "application/json",
      "cookie": cookie
  },
};
fetch(moisture_url, settings)
    .then(res => res.json())
    .then((json) => {
        curMoisture = json.latest_entry.data.moisture;
        console.log(curMoisture)
        const createDate = Moisture.create({
                      Moisture: curMoisture,
                  })  
    });
  }, (error) => {
    console.log(error);
  });

}

app.listen(3001);
setInterval(uploadData, 1000);