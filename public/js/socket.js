let ident;
let socket = io();

//Get message from server.
socket.on('update', (data) => {
    $("#messages").append('<li>'+ data.message + '</li>');
});


//Send message to server.
function sendMessage() 
{
    let sendStr=(""+$("#name").val()+ ": "+$("#comment").val())
    socket.emit('update', {'message':sendStr,'id':ident});
    $("#comment").val("")
    return false;
}

function recieveXY(x, y, comment){
    console.log("check4");
    socket.emit('change', {"xval":x, "yval":y, "comment":comment, "id":ident})
}



$(document).ready(function()
{ 
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

    $("#sendButton").click(sendMessage);
    $("#comment").keydown( function( event ) 
    {
        if ( event.which === 13 ) 
        {
            sendMessage();
            event.preventDefault();
            return false;
        }
    });
    updateCanvas()
    //console.log("Height: "+window.innerHeight + " |  Width: "+window.innerWidth)
});