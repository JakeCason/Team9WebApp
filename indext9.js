var express = require('express');
var bodyParser = require('body-parser');
var routes = require("./routes");
const myDatabase = require('./myDatabase');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/js', express.static('./public/js'));
app.use(routes);

app.use('/', express.static('./public'));//JAKE WHY 

let http = require('http');
let server = http.createServer(app);
let io = require('socket.io')(server);

let db = new myDatabase();
const Data = require('./Data');


const pulse = setInterval(function(){
    allUsers = db.returnAllUsers()
    io.emit('updateUsers', {"users":allUsers});
}, 16);

io.sockets.on('connection', function(socket) {
    socket.on('disconnect', function(){
        console.log(socket.id+" is leaving")
        db.removeUser({id:socket.id})
    })
});

app.post('/activateUser', function(req, res){
    let state = db.activateUser({"oldID":req.body.oldID,"newID":req.body.newID})
    res.cookie('id', req.body.newID);
    res.json({error:state});
});

app.post('/newUser', function(req, res){
    let user = db.newUser({"id":req.body.id,"name":req.body.name,"color":req.body.color})
    if (user)
    {
        res.cookie('id', req.body.id);
        res.cookie('name', req.body.name);
        res.cookie('color', req.body.color);
        db.displayData()
        res.json({error:false,"serverIp":1});
    }
    else{
        res.json({error:true});
    }
});

app.put('/updatePos', function(req, res){
    let goodUpload = db.updatePos({'id':req.body.id,'xpos':req.body.xpos,'ypos':req.body.ypos,'roomNum':req.body.roomNum,'message':req.body.message})
    
    if(goodUpload)
    {
        res.json({error:false});
    }
    else 
    {
        res.json({error:true});
    }
});

let port = process.env.PORT || 3009;
server.listen(port);