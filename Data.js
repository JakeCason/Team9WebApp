let Data = function(ident,name,color,isActive=false,xpos,ypos,roomNum,message)
{
    this.ident = ident;
    this.name = name;
    this.color = color;
    this.isActive = isActive
    this.xpos=xpos
    this.ypos=ypos
    this.roomNum=roomNum
    this.message=message
    
}

module.exports = Data;