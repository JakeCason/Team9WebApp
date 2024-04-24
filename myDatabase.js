const Data = require('./Data');
let dataIndex = 0;

let myDatabase = function() {
    this.data = [];
}

myDatabase.prototype.displayData = function() {
    for (let i=0;i<this.data.length;i++) {
        console.log(this.data[i]);
    }
}

myDatabase.prototype.newUser = function(_data) {
  this.data[dataIndex] = new Data(_data.id,_data.name,_data.color,false,100,100,0,"")

  if(this.data[dataIndex]){
    dataIndex++
    return true;
  }
  else return false
}

myDatabase.prototype.activateUser = function(_data) {
  retBool=true
  for (let i=0;i<this.data.length;i++) 
  {
    if (this.data[i] && this.data[i].ident == _data.id)
    {
      this.data[i].isActive=true
      retBool=false
    }
  }
  return (retBool)
}

myDatabase.prototype.removeUser = function(_data) {
  this.data.forEach(user => {
    console.log(user.ident+" | "+_data.id+" | "+user.isActive)
    if(user.ident==_data.id)
    {
      console.log(user.ident+" | "+_data.id+" | "+user.isActive)
      console.log("ID Match")
      if(user.isActive)
      {
        user.isActive=false
      }
    }
  });
  return
}

myDatabase.prototype.returnAllUsers = function(_data) {
  let users = this.data
  return (users)
}

myDatabase.prototype.updatePos = function(_data) {
  let retVal = false
  this.data.forEach(element => {
    if(String(element.ident) == String(_data.id))
    {
      element.xpos=_data.xpos
      element.ypos=_data.ypos
      retVal=true
    }
  })
  return(retVal)
}

myDatabase.prototype.postData = function(_data) {
  for (let i=0;i<this.data.length;i++) {
    if (this.data[i] && this.data[i].ident == _data.ident) {
      return false;
    }
  }
  if(dataIndex<_data.ident)
    dataIndex=_data.ident
  this.data[_data.ident] = new Data(_data.ident,_data.name);
  
  return true;
}

myDatabase.prototype.getData = function(ident) {
  for(i=0;i<=dataIndex;i++)
  {
    if(this.data[i]&&this.data[i].ident==ident)
    {
      return({name:this.data[i].name,ident:this.data[i].ident})
    }
  }
  return null;
}

myDatabase.prototype.putData = function(_data) {
  console.log("-----------------------------------")
  console.log(_data.ident)
  for (let i=0;i<this.data.length;i++) {
    if (this.data[i] && this.data[i].ident == _data.ident) {
      ////////
      this.data[i].name = _data.name;
      this.data[i].color = _data.color;
      this.data[i].isActive = true
      this.data[i].xpos=200
      this.data[i].ypos=200
      this.data[i].roomNum=0
      this.data[i].message=""
      ////////

      console.log("this.data[i]:")
      console.log(this.data[i])
      console.log("-----------------------------------")

      return true;
    }
  }
  console.log("Returning Flase?!?!?!?!?!?!?!?!?!?!?")
  console.log("-----------------------------------")

  return false;
}

module.exports = myDatabase;