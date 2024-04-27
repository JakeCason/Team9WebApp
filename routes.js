const myDatabase = require('./myDatabase');
let express = require("express");
const Data = require('./Data');
let path = require("path");

let router = express.Router();
let index=0;
router.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/login.html"));
});

router.get("/game",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/index.html"));
});

///////////////////////////////////////////////////////////////////////

router.post('/getIpAddress', function(req, res){
    let ip1 = req.ip
    let ip = req.socket.remoteAddress
    console.log(ip,ip1)
	res.json({"ip1":ip1,"ip":ip});
});

module.exports = router;