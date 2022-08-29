// var express = require('express');
// var router = express.Router();
//
//
// const request = require('request');
//
// router.get('/',function (req,res,next){
//     console.log("first step integration - default");
// });
//
//
// router.get('/tokenBalance', function(req, res, next) {
//
//     /* Restful API for integration with BA server */
//     request({
//         url: 'http://localhost:9119/getSLAResult?userId=user1&slaId=sla1',
//         method: 'GET',
//         json: true
//     }, function(error, response, body){
//         console.log("body: "+body);
//         console.log("response: "+response);
//
//     });
//
//
//     console.log("first step integration - BlockChain");
//     res.render('index', { title: 'ORACLE',paragraph:'developed by QUE' });
// });
//
//
// router.get('/getUserPseudonym', function(req, res, next) {
//
//     /* Restful API for integration with BA server */
//     request({
//         url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/getPseudonymFromId?lfmName=defaultmarket&resourceId=user1',
//         method: 'GET',
//         json: true
//     }, function(error, response, body){
//         console.log("body: "+body);
//         console.log("response: "+response);
//         console.log("Pseudonym: "+body["pseudonym"]);
//     });
//
//
//     console.log("first step integration - SLA");
//     res.render('index', { title: 'ORACLE',paragraph:'developed by QUE' });
// });
//
//
// router.get('/getPrepaidUserStatus', function(req, res, next) {
//
//     var status;
//     var credit = 0 ;
//
//
//     var device = {
//         url: 'http://192.168.100.145:8080/rest/things/zwave:device:371a0da7:node11',
//         method: 'GET',
//         json: true
//     };
//
//     var getWallet = {
//         url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/getWalletCredits?lfmName=defaultmarket&userId=user_test',
//         method: 'GET',
//         json: true
//     };
//
//     var chargeWallet = {
//         url: 'http://160.40.51.98:8080/cim/repository/cim/offchain/updateWalletCredits',
//         method: 'POST',
//         json: {
//             "lfmName": "defaultmarket",
//             "userId": "user_test",
//             "creditsAmount": -1
//         }
//     };
//
//
//
//     function prepaid(){
//         request(device, (err, response, body) => {
//             if (!err && response.statusCode == 200 && body.statusInfo.status == "ONLINE") { //device online means consumption
//                 console.log(body.statusInfo.status);
//                 request(getWallet, (err, response, body) => {
//                     if (!err && response.statusCode == 200) {
//                         console.log("User wallet after charge : "+body.wallets[0].creditsAmount);
//                         if(body.wallets[0].creditsAmount > 0){//if not empty then charge
//                             request(chargeWallet, (err, response, body) => {
//                                 if (!err && response.statusCode == 200) {
//                                     console.log("USER CHARGED SUCCESSFULLY");
//                                 }
//                             });
//                         }else{
//                             console.log("USER HAS ALREADY CONSUME ALL CREDITS");
//                             //NEED TO CLOSE THE DEVICE (?) OR CHARGE PENALTY (?)
//                         }
//                     }
//                 });
//             }
//         });
//     }
//
//
//     prepaid();
//
//     console.log("PREPAID SCENARIO - ORACLE");
//     res.render('index', { title: 'ORACLE',paragraph:'developed by QUE' });
// });
//
//
//
//
// module.exports = router;


// router.get('/getTest', function (req, res, next) {
//   res.json({
//     player:{
//       index:'50be8393119ad4ac660558486a3e806ffecce9a6c77189c942481b29e86e9e0b',
//       idx: "50be8393119ad4ac660558486a3e806ffecce9a6c77189c942481b29e86e9e0b",
//       address: "cosmos1rhcvf6tjfvgk06em4lwx0luq4657yzpy6d8yxp",
//       role: "prosumer",
//       creator: "cosmos1al5xpvaa5u38rzr65qednu0lzypwhpame6fx20"
//     }
//   });
// });
// router.get('/getTest2', function (req, res, next) {
//   res.json({
//     balance:{
//       denom:'ect',
//       amount: "99000",
//
//     }
//   });
// });
// const request = require("request");
// router.get('/check', function (req, res, next) {
//     var getAddress = {
//         url: 'http://localhost:8000/getTest2',
//         method: 'GET'
//     };
//     request(getAddress, (err, response, body) => {
//         if (!err && response.statusCode == 200) {
//             var responseBody = JSON.parse(body);
//             cosmosBalance = responseBody.balance.amount;
//             console.log(cosmosBalance);
//         }
//     });
// });