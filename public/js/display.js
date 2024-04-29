//Team 9
let ident = getCookieValue("id")
let socket = io();
var idnum = null;
let Users=[]
let testx = 200;
let testy = 200;
let floor = ""
//spruce
let wallColor = ""

//canvasApp level variables
var rotation = 0.0;
//var x = 50;       // xpos of space ship
//var y = 50;
var keyPressList = [];
var mouseX = 0;
var mouseY = 0;
var click = false;
var lastX=window.innerWidth/2;
var lastY=window.innerHeight/2;
var word = "";
var playcolor = $("#playercolor").val();
var room = 0;
var name = $("#playername").val();

var word = "";
let fps = 60 
var framecount = 0;
var users = [];

//////////////////////////////////////////////////////////////

$(document).ready(function(){ 
   $("#sendButton").click(sendMessage);
   $("#comment").keydown( function( event ) 
   {});
   $("#createNewPlayer").click(createNewPlayer);
   }); 

//////////////////////////////////////////////////////////////
socket.on('connect', () => {
   $.ajax({
      url: "/activateUser",
      type: "POST",
      data: {
         oldID:ident,
         newID:socket.id
      },
      success: function(data){
      if (data.error=="error")
         console.log("Unable to activate")
      else
         {
            ident=data.error
         }
      } ,     
      dataType: "json"
   });
});

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
   socket.emit('change', {"xval":x, "yval":y, "comment":comment, "id":ident, "name":name, "room":room, "color":color})
}

function updatePosition(){
   $.ajax({
      url: "/updatePos",
      type: "PUT",
      data: {
         'id':ident,
         'xpos':lastX,
         'ypos':lastY,
         'message':word,
         'roomNum':room
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
    testx+=200;
    testy+=200;

 return false;
}



///////////////////////////////////////////////////////////////////////////////////////////////////

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
      document.body.style.backgroundSize = "60px 60px"
      document.body.style.backgroundImage = "url('images/"+floor+".png')";
      
   
      //GROUP 9

      //Text output
      context.fillStyle = '#ffffff';
      context.font = '10px sans-serif';
      context.textBaseline = 'top';


      context.fillStyle = wallColor;
      context.fillRect(0, 0, window.innerWidth/2-90, 25);
      context.fillRect(0, 0, 25, window.innerHeight/2-110);

      context.fillRect(window.innerWidth-25, 0, -window.innerWidth/2+90+25, 25);
      context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight/2-110);

      context.fillRect(0, window.innerHeight-85,window.innerWidth/2-90, 25);
      context.fillRect(0, window.innerHeight-85, 25, -window.innerHeight/2+90+45);

      context.fillRect(window.innerWidth-25,window.innerHeight-85,-window.innerWidth/2+90+25,25);
      context.fillRect(window.innerWidth-25,window.innerHeight-85,25, -window.innerHeight/2+90+45);

      context.fillRect(window.innerWidth-25,window.innerHeight-85,25,25);

      
      context.fillStyle = '#ffffff'; //top wall
      context.font = "30px Segoe UI";
      context.fillText ("Room " + room, 30, 30);
      for (let i = 0; i < users.length; i++) 
      {
         if (users[i].isActive && users[i].roomNum == room) 
         {
            drawRect(users[i].xpos, users[i].ypos, rotation, 2, 2, users[i].color);
            context.fillStyle = '#ffffff';
            context.font = "25px Segoe UI";

            const userNameWidth = context.measureText(users[i].name).width;
            const centerXUsername = users[i].xpos - userNameWidth / 2;

            const messageWidth = context.measureText(users[i].message).width;
            const centerXMessage = users[i].xpos - messageWidth / 2;

            const usernameY = users[i].ypos - 65;
            const messageY = usernameY - 20;

            context.fillText(users[i].name, centerXUsername, usernameY);
            context.fillText(users[i].message, centerXMessage, messageY);
         }
      }
      context.fillStyle = wallColor; //top wall
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
         floor = "skulk"
         wallColor = "#261605"
         //spruce
      }else if(room == 1){
         floor = "lode"
         wallColor = "#463d47"
         //stoneBrick
         context.fillStyle = wallColor; 
         context.fillRect(0, 0, window.innerWidth, 25);
         context.fillRect(0, 0, 25, window.innerHeight);
         context.fillRect(0, window.innerHeight-85, window.innerWidth, 25);


      }else if(room == 2){
         floor = "stoneBlack"
         wallColor = "#2b0d0d"
         //blackstone brick
         context.fillStyle = wallColor;
         context.fillRect(0, 0, window.innerWidth, 25);
         context.fillRect(0, 0, 25, window.innerHeight);
         context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight);
         
         
      }else if(room == 3){
         floor = "purp"
         wallColor = "#bebf97"
         //purp
         context.fillStyle = wallColor; //top wall
         context.fillRect(0, 0, window.innerWidth, 25);
         context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight);
         context.fillRect(0, window.innerHeight-85, window.innerWidth, 25);

         
      }else if(room == 4){
         floor = "pris"
         wallColor = "#32b3b3"
         //nether
         context.fillStyle = wallColor; 
         context.fillRect(0, 0, 25, window.innerHeight);
         context.fillRect(window.innerWidth-25, 0, 25, window.innerHeight);
         context.fillRect(0, window.innerHeight-85, window.innerWidth, 25);


      }  
      {

         let leftWall = 65
         let rightWall = window.innerWidth - 65
         let bottomWall = window.innerHeight - 125
         let topWall = 65

         let bottomHallway = window.innerHeight/2+20
         let topHallway = window.innerHeight/2-70
         let leftHallway = window.innerWidth/2-50
         let rightHallway = window.innerWidth/2+60

            if(lastX < leftWall && lastY > bottomWall){ //check left bottom corner
               lastX = leftWall
               lastY = bottomWall
            }else if(lastX < leftWall && lastY < topWall){ //check left top corner
               lastX = leftWall
               lastY = topWall
            }else if(lastX > rightWall && lastY < topWall){ //check top right corner
               lastX = rightWall
               lastY = topWall
            }else if(lastX > rightWall && lastY > bottomWall){ //check bottom right corner
               lastX = rightWall
               lastY = bottomWall
            }

         if(room == 0){
            if(lastX < leftWall){ //check left
               if(lastY > topHallway && lastY < bottomHallway){
                  lastX = rightWall
                  room = 1
               }else{
                  lastX = leftWall
               }
               
            }else if(lastY < topWall){ //check top
               if(lastX > leftHallway && lastX < rightHallway){
                  lastY = bottomWall
                  room = 2
               }else{
                  lastY = topWall
               }
            }else if(lastX > rightWall){ //check right
               if(lastY > topHallway && lastY < bottomHallway){
                  lastX = leftWall
                  room = 3
               }else{
                  lastX = rightWall
               }
            }else if(lastY > bottomWall){ //check bottom
               if(lastX > leftHallway && lastX < rightHallway){
                  lastY = topWall
                  room = 4
               }else{
                  lastY = bottomWall
               }
            }
         }else if(room == 1){
            if(lastX < leftWall){ //check left
               lastX = leftWall
               
            }else if(lastY < topWall){ //check top
               lastY = topWall
            }
            else if(lastX > rightWall){//check right and switch room
               if(lastY > topHallway && lastY < bottomHallway){
                  lastX = leftWall
                  room = 0
               }else{
                  lastX = rightWall
               }
            }else if(lastY > bottomWall){ //check bottom
               lastY = bottomWall
            }
         }else if(room == 2){ 
            if(lastX > rightWall){ //check right
               lastX = rightWall
            }else if(lastX < leftWall){ //check left
               lastX = leftWall
            }else if(lastY < topWall){ //check top
               lastY = topWall
            }else if(lastY > bottomWall){ //check bottom and switch room
               if(lastX > leftHallway && lastX < rightHallway){
                  lastY = topWall
                  room = 0
               }else{
                  lastY = bottomWall
               }
            }
         }else if(room == 3){ 
            if(lastX > rightWall){ //check right
               lastX = rightWall
            }else if(lastX < leftWall){ //check left and switch room
               if(lastY > topHallway && lastY < bottomHallway){
                  lastX = rightWall
                  room = 0
               }else{
                  lastX = leftWall
               }
            }else if(lastY < topWall){ //check top
               lastY = topWall
            }else if(lastY > bottomWall){ //check bottom 
               lastY = bottomWall
            }
            
         }else if(room == 4){ 
            if(lastX > rightWall){ //check right
               lastX = rightWall
            }else if(lastX < leftWall){ //check left 
               lastX = leftWall
            }else if(lastY < topWall){ //check top and switch room
               if(lastX > leftHallway && lastX < rightHallway){
                  lastY = bottomWall
                  room = 0
               }else{
                  lastY = topWall
               }
            }else if(lastY > bottomWall){ //check bottom 
               lastY = bottomWall
            }
            
         }

      }
   }
}


