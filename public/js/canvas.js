let ident;
let socket = io();
var idnum = null;
let allActiveUsers=[]
let testx = 200;
let testy = 200;
let floor = "spruce"
//////////////////////////////////////////////////////////////
//New From Updated Ver

function createClicked(){
   $.ajax({
     url: "/create",
     type: "POST",
     data: {identifier:$("#identifier").val(),
             name:$("#name").val(),
             speed:$("#speed").val()
           },
     success: function(data){
         if (data.error)
           alert("bad");
         else
           alert("good");
       } ,     
     dataType: "json"
   });   
return false;
}    
 

$(document).ready(function(){ 
   //Get Welcome message from server.
   socket.on('welcome', function(data) 
   {
       $("#name").val(data.id);
       ident = data.id;
       name=ident;
       sendStr=""
       sendStr+=(ident+" has joined that chat")
       socket.emit('update', {'message':sendStr});
   });
   $("#createNewPlayer").click(createNewPlayer);
   $("#sendButton").click(sendMessage);
   $("#comment").keydown( function( event ) 
   {
       
   });
});     


//////////////////////////////////////////////////////////////

socket.on('updateUsers', (data) => {
   console.log("getting data")
   allActiveUsers=data.users
   
   if(allActiveUsers)
   {
      for(let i=0;i<allActiveUsers.length;i++)
      {
         console.log(allActiveUsers[i].xpos);
         console.log(allActiveUsers[i].name);
      }
   }
   else{
      console.log("No Users")
   }
   
   
});

//Get message from server.
socket.on('update', (data) => {
    $("#messages").append('<li>'+ data.message + '</li>');
});


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
 return false;
}

//Send message to server.
function sendMessage() 
{
    let sendStr=(""+$("#name").val()+ ": "+$("#comment").val())
    socket.emit('update', {'message':sendStr,'id':ident});
    $("#comment").val("")
    return false;
}

function recieveXY(x, y, comment, name, room, color){
    console.log("check4");
    socket.emit('change', {"xval":x, "yval":y, "comment":comment, "id":ident, "name":name, "room":room, "color":color})
}


/////////////////////////////////////////////////////////////////////////////////

function readClicked(){
   $.ajax({
     url: "/read",
     type: "GET",
     data: {identifier:$("#identifier").val()},
     success: function(data){
         if (data.error)
           alert("bad");
         else {
           $("#playername").val(data.name);
           console.log(data.speed)
           $("#speed").val(data.speed);
         }
       } ,     
     dataType: "json"
   });   
return false;
} 
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
   
   gameLoop();
///////////////////////////////////////////////////////
   function gameLoop()
   {
        theCanvas.width=window.innerWidth
        theCanvas.height=window.innerHeight-60;
        var intervalTime = 1000/fps;
        framecount++;
        console.log("Loog: "+framecount)
        input();
        paint();
        animate();
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
      console.log("Inpt")
       if (keyPressList[38]==true){
         console.log(":up")
       //Up arrow
       lastY-=5;
       socket.emit('updatePos', {'id':ident,'xpos':lastX,'ypos':lastY});

       if(framecount%3==0)
       {
       }
       
       }
       if (keyPressList[37]==true) {
       //Left arrow
         lastX-=5;
         if(framecount%3==0)
         {
            socket.emit('updatePos', {'id':ident,'xpos':lastX,'ypos':lastY});
         }
       }
       if (keyPressList[39]==true) {
       //Right arrow
         lastX+=5;
         if(framecount%3==0)
         {
            socket.emit('updatePos', {'id':ident,'xpos':lastX,'ypos':lastY});
         }
       }
       if(keyPressList[40] == true)
       {
         lastY+=5;
         
         if(framecount%3==0)
         {
            socket.emit('updatePos', {'id':ident,'xpos':lastX,'ypos':lastY});
         }
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
      context.fillStyle = '#000000';
      //document.body.style.backgroundSize = "80px 80px"
      //document.body.style.backgroundImage = "url('https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1691771346/vistausdorg/brifbeifpyomfk17bntk/classof2024-logo.png')";

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

      if (click)
      context.fillText  ("click", 0, 180);
      else
      context.fillText  ("" + mouseX + " " + mouseY, 0, 180);
      
      context.fillStyle = '#ffffff';
      context.fillText ("word", lastX-20, lastY-50); //message
      
      context.font = "50px Georgia";
      
      context.fillStyle = '#ffffff'; //top wall
      context.fillText ("Room " + room, 30, 30);

      for(let i=0; i<users.length;i++)
      {
         console.log("CHECK")
         drawRect(users[i].xpos, users[i].ypos, rotation, 2, 2, users[i].color)
         
         console.log(users[i].xpos + " " + users[i].ypos + " " + users[i].color)
      }
      drawRect(lastX,lastY,rotation,2,2, playcolor);
      //drawRect(200, 200, 0, 2,2, "#00ff00");

      //content.opacity = 0.3;
      
      context.fillStyle = '#505050'; //top wall
      
      context.fillRect(lastX-name.length*5.5-7, lastY+45, name.length*13, 20);
      
      
     

      context.font = "20px Courier New";
      context.fillStyle = '#ffffff';
      context.fillText (name, lastX-name.length*6, lastY+45) //username
   //});


   


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

  
   
////////////////////////////////////////////////////////
}


