var express = require('express');
var bodyParser = require('body-parser');
var routes = require("./routes");
const myDatabase = require('./myDatabase');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/js', express.static('./public/js'));
app.use(routes);

app.use('/', express.static('./public'));

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
    //console.log("A User Has Joined")
    //Disconnect Code Here
    let recent = "";
    socket.on('disconnect', function(){
        //to(socket.id)
        io.emit('disconnectID', null);
        
        console.log("User "+socket.id+" Has Disconnected")
        db.removeUser({id:socket.id})
    }) 
    
    socket.on('discon', function(data){
        recent = data.ident;
        console.log(recent + "HELLO");
    })


});
io.on('sayHello', function(socket){
console.log("hello")
})

io.sockets.on('updatePos', function(socket) {
    res.json({error:true});
});

app.post('/activateUser', function(req, res){
    console.log("activating User")
    let state = db.activateUser({"id":req.body.id})
    res.json({error:state});
});

app.post('/newUser', function(req, res){
    let user = db.newUser({"id":req.body.id,"name":req.body.name,"color":req.body.color})
    console.log("User is: "+user)
    if (user)
    {
        res.cookie('id', req.body.id);
        res.cookie('name', req.body.name);
        res.cookie('color', req.body.color);
        console.log("Redirecting")
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

app.put('/update', function(req, res){
    console.log("Calling Broken Code")
});
let port = process.env.PORT || 3009;
server.listen(port);
