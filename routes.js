const myDatabase = require('./myDatabase');
let express = require("express");
const Data = require('./Data');
let path = require("path");

let router = express.Router();
let db = new myDatabase();
let index=0;
router.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/login.html"));
});

router.get("/game",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/index.html"));
});

///////////////////////////////////////////////////////////////////////

router.post('/create', function(req, res){
    let obj = new Data(0, req.body.name,req.body.color,req.body.xpos,req.body.ypos,req.body.roomNum,req.body.message);
    console.log("Person Created: "+obj.name)
    
    let val = db.postData(obj);

    if (val)
        res.json({error:false, "index":index});
    else
        res.json({error:true});

    console.log(val)
    index++;
    
});

router.post('/getIpAddress', function(req, res){
    let ip1 = req.ip
    let ip = req.socket.remoteAddress
    console.log(ip,ip1)
	res.json({"ip1":ip1,"ip":ip});
});

module.exports = router;