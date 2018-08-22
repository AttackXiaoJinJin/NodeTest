let socketio=require("socket.io")
let io
//默认一人
let guestNumber=1
let nickNames={}
//曾用名
let namesUsed=[]
//当前聊天室
let currentRoom={}

//启动Socket.IO服务器
exports.listen=(server)=>{
  //启动SocketIO服务器，允许它搭载在已有的HTTP服务器上
  io=socketio.listen(server)
  io.set("log level",1)
  io.sockets.on("connection",(socket)=>{
    //在用户连接的时候，给他一个名字
    guestNumber=assignGuestName(socket,guestNumber,nickNames,namesUsed)
    //在给名字后，把他默认分配到Lobby聊天室里
    joinRoom(socket,"Lobby")
    //处理用户消息
    handleMessageBroadcasting(socket,nickNames)
    //处理用户更换昵称
    handleNameChangeAttempts(socket,nickNames,namesUsed)
    //处理用户创建/更换聊天室
    handleRoomJoining(socket)
    //用户发送请求时，向用户提供已经被创建的聊天室的列表
    socket.on("rooms",()=>{
      socket.emit("rooms",io.sockets.manager.rooms)
    })
    //用户断开连接后，清除
    handleClientDisconnetion(socket,nickNames,namesUsed)




  })


}

