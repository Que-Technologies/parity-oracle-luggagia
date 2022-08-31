var express = require('express');
var router = express.Router();

var fs = require('fs');
var request = require('request');
var {exec} = require("child_process");
var schedule = require("node-schedule");
var smartboxSerial;

router.get('/', function (req, res, next) {
  console.log("first step integration - default");
});


router.get('/tokenBalance', function (req, res, next) {

  /* Restful API for integration with BA server */
  request({
    url: 'http://localhost:9119/getSLAResult?userId=user1&slaId=sla1',
    method: 'GET',
    json: true
  }, function (error, response, body) {
    console.log("body: " + body);
    console.log("response: " + response);

  });


  console.log("first step integration - BlockChain");
  res.render('index', {title: 'ORACLE', paragraph: 'developed by QUE'});
});


router.get('/getUserPseudonym', function (req, res, next) {

  /* Restful API for integration with BA server */
  request({
    url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/getPseudonymFromId?lfmName=defaultmarket&resourceId=user1',
    method: 'GET',
    json: true
  }, function (error, response, body) {
    console.log("body: " + body);
    console.log("response: " + response);
    console.log("Pseudonym: " + body["pseudonym"]);
  });

  console.log("first step integration - SLA");
  res.render('index', {title: 'ORACLE', paragraph: 'developed by QUE'});
});


router.get('/getPrepaidUserStatus', function (req, res, next) {

  var status;
  var credit = 0;


  var device = {
    url: 'http://192.168.100.145:8080/rest/things/zwave:device:371a0da7:node11',
    method: 'GET',
    json: true
  };

  var getWallet = {
    url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/getWalletCredits?lfmName=defaultmarket&userId=user_test',
    method: 'GET',
    json: true
  };

  var chargeWallet = {
    url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/updateWalletCredits',
    method: 'POST',
    json: {
      "lfmName": "defaultmarket",
      "userId": "user_test",
      "creditsAmount": -1
    }
  };


  function prepaid() {
    request(device, (err, response, body) => {
      if (!err && response.statusCode == 200 && body.statusInfo.status == "ONLINE") { //device online means consumption
        console.log(body.statusInfo.status);
        request(getWallet, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            console.log("User wallet after charge : " + body.wallets[0].creditsAmount);
            if (body.wallets[0].creditsAmount > 0) {//if not empty then charge
              request(chargeWallet, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                  console.log("USER CHARGED SUCCESSFULLY");
                }
              });
            } else {
              console.log("USER HAS ALREADY CONSUME ALL CREDITS");
              //NEED TO CLOSE THE DEVICE (?) OR CHARGE PENALTY (?)
            }
          }
        });
      }
    });
  }


  prepaid();

  console.log("PREPAID SCENARIO - ORACLE");
  res.render('index', {title: 'ORACLE', paragraph: 'developed by QUE'});
});

/*
Create scheduler to update user balance every 15 minutes
 */
/**
 * This function run asynchronously using a scheduler which triggered every 15 minutes and make the below requests.
 * request 1: Retrieve a unique number from rpi as userId .
 * request 2: Retrieve the balance from blockchain for the specific userId.
 * request 3: update the balance on wallet using this userId as well.
 * **/
schedule.scheduleJob('*/1 * * * *', async function () {

  console.log('============== Service Status : STARTED =================');

  var name = await getSerial();
  var pseudonym = await getPseudonym(name);
  var address = await getAddress(pseudonym);
  var myBalance = await getBalance(address);
  await updateWallet(name,myBalance);

  console.log('============== Service Status : FINISHED =================');
});

function getSerial(){
  return new Promise(resolve => {
    var serialAll = fs.readFileSync('/home/pi/name',
        {encoding:'utf8', flag:'r'});
    var serial = serialAll.split('-')[1];
    console.log("My serial is:"+serial);
    resolve(serial);
  });
}

function getPseudonym(serial){
  return new Promise(resolve => {
    request({
        url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/getPseudonymFromId?lfmName=lugpilotmarket&resourceId='+serial,
        method: 'GET',
        json: true
    }, function(error, response, body){
        // console.log("body: "+body);
        // console.log("response: "+response);
        console.log("Pseudonym: "+body["pseudonym"]);
        resolve(body["pseudonym"]);

    });
    // resolve(serial);
  });
}

function getAddress(pseudonym){
  return new Promise(resolve => {
    var getAddress = {
      url: 'http://localhost:9119/player/'+pseudonym,
      method: 'GET'
    };
    request(getAddress, (err, response, body) => {
      console.log("Make request to: http://localhost:9119/player/"+pseudonym);
      if (!err && response.statusCode == 200) {
        var responseBody = JSON.parse(body);
        var address = responseBody.player.address;
        console.log("COSMOS ADDRESS RETRIEVED SUCCESSFULLY - ADDRESS IS: ", address);
        resolve(address);
      }else{
        console.log("No COSMOS ADDRESS RETRIEVED");
        resolve("0");
      }
    });
  });
}

function getBalance(address){
  return new Promise(resolve => {
    var getBalance = {
      url: 'http://localhost:9119/balances/'+address+'/ect',
      method: 'GET'
    };
    var cosmosBalance;
    request(getBalance, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        var responseBody = JSON.parse(body);
        cosmosBalance = responseBody.balance.amount;
        console.log("COSMOS BALANCE RETRIEVED SUCCESSFULLY - CURRENT BALANCE IS: ", cosmosBalance);
        resolve(cosmosBalance);
      }else{
        console.log("No COSMOS BALANCE RETRIEVED");

        resolve(0)
      }
    });

  });
}

function updateWallet(serial,cosmosBalance){
  return new Promise(resolve => {
    var updateWallet = {
      url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/updateWalletCreditsBalance',
      method: 'POST',
      json: {
        "lfmName": "lugpilotmarket",
        "userId": serial,
        "creditsAmount": parseInt(cosmosBalance,10)
      }
    };
    console.log("Update wallet request: ",updateWallet);
    request(updateWallet, (err, response, body) => {
      var resp = JSON.parse(body);
      console.log("Update wallet response status code: ",response.statusCode);
      console.log("Update wallet response body: ",resp);
      if (!err && response.statusCode == 200) {
        console.log("USER UPDATED SUCCESSFULLY");
        resolve();

      }
    });

  });
}

module.exports = router;
