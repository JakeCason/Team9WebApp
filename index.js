var express = require('express');
var bodyParser = require('body-parser');
var routes = require("./routes");
const myDatabase = require('./myDatabase');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/js', express.static('./public/js'));
app.use(routes);

let http = require('http');
let server = http.createServer(app);
//let io = require('socket.io').listen(server);
  let io = require('socket.io')(server);

let db = new myDatabase();
const Data = require('./Data');


//-------------------new v
const pulse = setInterval(function(){
    allUsers = db.returnAllUsers()
    io.emit('updateUsers', {"users":allUsers});
}, 100);
//-----------------new ^

io.sockets.on('connection', function(socket) {
    console.log("A User Has Joined")
    //Disconnect Code Here
    /*
    socket.on('disconnect', function(){
        db.removeUser({id:socket.id})
        console.log("User "+socket.id+" Has Disconnected")
    })  */
});
io.on('sayHello', function(socket){
console.log("hello")
})

io.sockets.on('updatePos', function(socket) {
    console.log("Socket updatePos called")
    //console.log(socket.id)
    //console.log(socket)
    //db.updatePos({id:0,xpos:0,ypos:0})
    /*
    if (user)
    {
        console.log("Redirecting")
        db.displayData()
        res.json({error:false,"serverIp":1});
    }
    else{
        res.json({error:true});
    }
    */
    res.json({error:true});
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

app.put('/update', function(req, res){
    console.log("Calling Broken Code")
});
let port = process.env.PORT || 3009;
server.listen(port);