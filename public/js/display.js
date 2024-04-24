//Team 9
let ident = getCookieValue("id")
console.log(ident)
let socket = io();
var idnum = null;
let Users=[]
let testx = 200;
let testy = 200;
let floor = "spruce"

   //canvasApp level variables
   var rotation = 0.0;
   //var x = 50;       // xpos of space ship
   //var y = 50;
   var keyPressList = [];
   var mouseX = 0;
   var mouseY = 0;
   var click = false;
   var lastX=window.innerWidth/2;
   var lastY=window.innerWidth/2;
   var word = "";
   var playcolor = $("#playercolor").val();
   var room = 0;
   var name = $("#playername").val();

//////////////////////////////////////////////////////////////

$(document).ready(function(){ 
   //Get Welcome message from server.
   socket.on('welcome', function(data) 
   {
      $("#name").val(data.id);
       ident = data.id;
       name=ident;
       sendStr=""
       sendStr+=(ident+" has joined that chat")
       socket.emit('sayHello', {'message':sendStr});
   });
   socket.id=getCookieValue("id")
   $("#sendButton").click(sendMessage);
   $("#comment").keydown( function( event ) 
   {
       
   });
   $("#createNewPlayer").click(createNewPlayer);
   $.ajax({
      url: "/activateUser",
      type: "POST",
      data: {
         id:ident
      },
      success: function(data){
          if (data.error)
            console.log("Unable to activate")
        } ,     
      dataType: "json"
    });
    console.log("Socket ID: " + socket.id)
    console.log("Ident: " + ident)
});     


//////////////////////////////////////////////////////////////

socket.on('updateUsers', (data) => {
   users=data.users
});

//Get message from server.
socket.on('update', (data) => {
    $("#messages").append('<li>'+ data.message + '</li>');
});

function sendMessage() 
{
    let sendStr=(""+$("#name").val()+ ": "+$("#comment").val())
    socket.emit('update', {'message':sendStr,'id':ident});
    $("#comment").val("")
    return false;
}

function recieveXY(x, y, comment, name, room, color){
   //console.log("check4");
   socket.emit('change', {"xval":x, "yval":y, "comment":comment, "id":ident, "name":name, "room":room, "color":color})
}

function updatePosition(){
   $.ajax({
      url: "/updatePos",
      type: "PUT",
      data: {
         id:ident,
         xpos:lastX,
         ypos:lastY
      },
      success: function(data){
          if (data.error)
            console.log("User Error")
        } ,     
      dataType: "json"
    });   
}

function getCookieValue(name) 
{
  const regex = new RegExp(`(^| )${name}=([^;]+)`)
  const match = document.cookie.match(regex)
  if (match) {
    return match[2]
  }
}

/////////////////////////////////////////////////////////////////////////////////

function updateClicked(xpos, ypos, room){
   input="temp"
   $.ajax({
     url: "/update",
     type: "PUT",
     data: {
       id:(idnum),
       name:($("#playername").val()),
       color:($("#playercolor").val()),
       xpos:(xpos),
       ypos:(ypos),
       roomNum:(room),
       message:($("#comment").val())
     },
     success: function(data){
         if (data.error)
           alert("bad");
       } ,     
     dataType: "json"
   });   
return false;
}

function createNewPlayer(){
   console.log("Creating New Person:")

   $.ajax({
      url: "/create",
      type: "POST",
      data: {
        name:($("#playername").val()),
        color:($("#playercolor").val()),
        xpos:(testx),
        ypos:(testy),
        roomNum:(0),
        message:($("#comment").val())
      },
      success: function(data){
          if (data.error)
            alert("bad");
         else{
            alert("created");
            idnum = data.index;
            
         }
         
        } ,     
      dataType: "json"
    });
    console.log("YOUR MOTHER")
    testx+=200;
    testy+=200;

 return false;
}



///////////////////////////////////////////////////////////////////////////////////////////////////

var word = "";
let fps = 60 
var framecount = 0;
var users = [];


window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
   canvasApp();
}
function canvasApp(){

var theCanvas = document.getElementById("canvas");
theCanvas.addEventListener("mousemove",onMouseMove,false);
theCanvas.addEventListener("click",onMouseClick,false);

   if (!theCanvas || !theCanvas.getContext) {
      return;
   }
   var context = theCanvas.getContext("2d");
   if (!context) {
      return;
   }
   
   gameLoop();
///////////////////////////////////////////////////////
   function gameLoop()
   {
        theCanvas.width=window.innerWidth
        theCanvas.height=window.innerHeight-60;
        var intervalTime = 1000/fps;
        framecount++;
        input();
        paint();
        animate();
        updatePosition();
        window.setTimeout(gameLoop, intervalTime);
   }

   document.onkeydown = function(e){
      e = e?e:window.event;
      keyPressList[e.keyCode] = true;
   }
   document.onkeyup = function(e){
      e = e?e:window.event;
      keyPressList[e.keyCode] = false;
   };
///////////////////////////////////////////////////////
   function onMouseMove(e)
   {
        mouseX = e.clientX - theCanvas.offsetLeft;
        mouseY = e.clientY - theCanvas.offsetTop;
   }
   function onMouseClick(e)
   {
        click = !click;
   }
   function input()
   {
       if (keyPressList[38]==true){
         //Up arrow         
         lastY-=5;
       }
       if (keyPressList[37]==true) {
         //Left arrow
         lastX-=5;
      }
      if (keyPressList[39]==true){
         //Right arrow
         lastX+=5;
      }
      if(keyPressList[40] == true)
      {
         lastY+=5;
      }

       if(keyPressList[13] == true)
        {
          word = $("#comment").val();
          name = $("#playername").val();
          //$("#comment").val("");
         if(framecount%3==0)
         {
            recieveXY(lastX, lastY, word, name, room, playcolor);
         }
        }
   }

   function paint()
   {
      // draw background
      context.fillStyle = '#000000';
      //context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      //let shrunken = document.getElementById("url('downloads/images/shrunkenTower.jpg')");
      //shrunken.style.backgroundPosition = "center";
      //document.body.style.backgroundSize = window.innerWidth+"px "+ window.innerHeight+"px"
      document.body.style.backgroundSize = "80px 80px"
      //document.body.style.backgroundImage = "url(downloads/images/"+floor+".png)";
      document.body.style.backgroundImage = "url('https://ih0.redbubble.net/image.4945968103.7727/raf,360x360,075,t,fafafa:ca443f4786.jpg')";
      
   
      //GROUP 9

      //Text output
      context.fillStyle = '#ffffff';
      context.font = '10px sans-serif';
      context.textBaseline = 'top';

      context.fillStyle = '#505050';
      context.fillRect(0, 0, 25, 25);
      context.fillStyle = '#505050';
      context.fillRect(window.innerWidth-25, 0, 25, 25);
      context.fillStyle = '#505050';
      context.fillRect(0, window.innerHeight-85, 25, 25);
      context.fillStyle = '#505050';
      context.fillRect(window.innerWidth-25,window.innerHeight-85,25,25);

      
      context.fillStyle = '#ffffff'; //top wall
      context.fillText ("Room " + room, 30, 30);
      for(let i=0; i<users.length;i++)
      {
         if(users[i].isActive)
         {
            drawRect(users[i].xpos, users[i].ypos, rotation, 2, 2, users[i].color)
            context.fillStyle = '#ffffff';
            context.font = "30px Segoe UI";
            context.fillText ("|"+users[i].isActive+"|", users[i].xpos, users[i].ypos); //message
            context.fillText (users[i].name, users[i].xpos-50, users[i].ypos-65);
         }
      }
      context.fillStyle = '#505050'; //top wall
      context.font = "20px Courier New";
      context.fillStyle = '#ffffff';
      //context.fillText (name, lastX-name.length*6, lastY+45) //username
   }
   function drawRect(xpos,ypos,rot,xscale,yscale, color)
   {
        context.save(); //save current state in stack
        context.setTransform(1,0,0,1,0,0);
        context.translate(xpos,ypos);
        context.rotate(rot);
        context.scale(xscale,yscale);
        context.fillStyle = color; 
        context.fillRect(-20,-20,40,40);
        context.restore(); //pop old state on to screen
   }
   function animate()
   {
      playcolor =$("#playercolor").val();

      if(room == 0){
         floor = "spruce"
      }else if(room == 1){
         floor = "brickstone"
         context.fillStyle = '#505050'; //top wall
         context.fillRect(0, 0, window.innerWidth, 25);
         context.fillStyle = '#505050'; //left wall
         context.fillRect(0, 0, 25, window.innerHeight);
         context.fillStyle = '#505050'; //bottom wall
         context.fillRect(0, window.innerHeight-85, window.innerWidth, 25);


      }else if(room == 2){
         floor = "blackstone"
         context.fillStyle = '#505050'; //top wall
         context.fillRect(0, 0, window.innerWidth, 25);
         context.fillStyle = '#505050'; //left wall
         context.fillRect(0, 0, 25, window.innerHeight);
         context.fillStyle = '#505050'; //right wall
         context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight);
         
         
      }else if(room == 3){
         floor = "purp"
         context.fillStyle = '#505050'; //top wall
         context.fillRect(0, 0, window.innerWidth, 25);
         context.fillStyle = '#505050'; //right wall
         context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight);
         context.fillStyle = '#505050'; //bottom wall
         context.fillRect(0, window.innerHeight-85, window.innerWidth, 25);

         
      }else if(room == 4){
         floor = "nether"
         context.fillStyle = '#505050'; //left wall
         context.fillRect(0, 0, 25, window.innerHeight);
         context.fillStyle = '#505050'; //right wall
         context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight);
         context.fillStyle = '#505050'; //bottom wall
         context.fillRect(0, window.innerHeight-85, window.innerWidth, 25);


      }
      {
      if(lastX<=0 && room == 0)
      {
         room = 1;
         lastX = window.innerWidth-1;
      }
      else if(lastX<=0 && room == 3){
        room = 0;
        lastX = window.innerWidth-1;
      }
      else if(lastX>=window.innerWidth && room == 0)
      {
         room = 3;
         lastX = 1;
      }
      else if(lastX>=window.innerWidth && room == 1)
      {
         room = 0;
         lastX = 1;
      }
      else if(lastY<=0 && room == 0)
      {
         room = 2;
         lastY = window.innerHeight-1;
      }
      else if(lastY<=0 && room == 4)
      {
         room = 0;
         lastY = window.innerHeight-1;
      }
      else if(lastY>=window.innerHeight && room == 0)
      {
         room = 4;
         lastY = 1;
      }
      else if(lastY>=window.innerHeight && room == 2)
      {
            room = 0;
            lastY = 1;
      }
      else if(lastX<40 && room == 1)
      {
         lastX = 41;
      }
      else if(lastY<=39 && room == 1)
      {
         lastY = 40;
      }
      else if(lastY>=window.innerHeight-100 && room == 1)
      {
         lastY = window.innerHeight-101;
      }
      else if(lastX<=0 && room == 2)
      {
         lastX = 1;
      }
      else if(lastX>=window.innerWidth && room == 2)
      {
         lastX = window.innerWidth-1;
      }
      else if(lastY<=0 && room == 2)
      {
         lastY = 1;
      }
      else if(lastX>=window.innerWidth-39 && room == 3)
      {
         lastX = window.innerWidth-40;
      }
      else if(lastY<=39 && room == 3)
      {
         lastY = 40;
      }
      else if(lastY>=window.innerHeight-100 && room == 3)
      {
         lastY = window.innerHeight-101;
      }
      else if(lastX>=window.innerWidth && room == 4)
      {
         lastX = window.innerWidth-1;
      }
      else if(lastX<=39 && room == 4)
      {
         lastX = 40;
      }
      else if(lastY>=window.innerHeight-100 && room == 4)
      {
         lastY = window.innerHeight-101;
      }
      }
   }
}


