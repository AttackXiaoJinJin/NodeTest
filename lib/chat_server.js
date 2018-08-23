let socketio=require("socket.io")
let io
//默认一人
let guestNumber=1
let nickNames={}
//曾用名
let namesUsed=[]
//当前聊天室
let currentRoom={}

//启动Socket.IO服务器=================
exports.listen=(server)=>{
  //启动SocketIO服务器，允许它搭载在已有的HTTP服务器上
  io=socketio.listen(server)
  //限制socketio向控制台输出的日志详细程度
  // io.set("log level",1)
  io.sockets.on("connection",(socket)=>{
    //assignGuestName: 在用户连接的时候，给他一个名字
    //该 guestNumber 是新的未有昵称联系的 昵称number
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
    handleClientDisconnection(socket,nickNames,namesUsed)
  })
}

//分配用户昵称==================================
function assignGuestName(socket,guestNumber,nickNames,namesUsed) {
  let name="小可爱 "+guestNumber+" 号"
//  将用户昵称跟客户端连接ID相关联
  nickNames[socket.id]=name
//  发送昵称给客户端，让用户看到他们自己的昵称
  socket.emit("nameResult",{
    success:true,
    name:name
  })
//  存放已经被占用的昵称
  namesUsed.push(name)
//  增加昵称计数器
  return guestNumber+1
}

//进入聊天室====================
function joinRoom(socket,room) {
//  让用户加入房间
  socket.join(room)
//  记录当前用户所在的房间
  currentRoom[socket.id]=room
//  让用户知道他们进入了新房间
  socket.emit("joinResult",{room:room})
//  通知该房间的其他用户，有新用户进入了该房间
  socket.broadcast.to(room).emit("message",{
    text:nickNames[socket.id]+" 已经进入「"+room+"」啦！"
  })
//  确认有哪些用户在该房间里
  let usersInRoom=io.sockets.clients(room)
//  当用户数量大于1时，收集该房间里所有用户的昵称信息
  let roomInfo=""
  if(usersInRoom.length>1){
    roomInfo="你当前所处的房间「"+room+"」有如下的成员："
    for(let index in usersInRoom){
      let userSocketId=usersInRoom[index].id
      //排除当前用户
      if(userSocketId!==socket.id){
        //不能在第一个用户如 aa，前面加「，」
        if(index>0){
          roomInfo+="，"
        }
        roomInfo+=nickNames[userSocketId]
      }
    }
    roomInfo+="。"
  //  将房间信息发送给当前用户
    socket.emit("message",{text:roomInfo})
  }
}

//处理 昵称变更请求
function handleNameChangeAttempts(socket,nickNames,namesUsed){
//  添加 更换昵称的监听器
  socket.on("nameChange",(name)=>{
    //说明是以Guest开头的
    if(name.indexOf("Guest")===0){
      socket.emit("nameResult",{
        success:false,
        message:"名字不能以「Guest」开头，请更换其他昵称重试！"
      })
    }else{
      //说明该昵称未被使用过
      if(namesUsed.indexOf(name)===-1){
        //将之前的昵称保存
        let previousName=nickNames[socket.id]
        //当系统自动创建名字的时候，已将该昵称放进namesUsed数组中，现在需要查找该昵称位置
        let previousNameIndex=namesUsed.indexOf(previousName)
        //将新名字加入namesUsed
        namesUsed.push(name)
      //  更新名字
        nickNames[socket.id]=name
      //  删除旧名字,让其他用户使用（除Guest开头）
        delete namesUsed[previousNameIndex]
      //  通知用户名称更换成功
        socket.emit("nameResult",{
          success:true,
          name:name
        })
      //  通知当前房间，当前用户更改昵称的消息
        socket.broadcast.to(currentRoom[socket.id]).emit("message",{
          text:"「"+previousName+"」已更改成「"+name+"」。"
        })
      }else{
        socket.emit("nameResult",{
          success:false,
          message:"该名称已被他人使用，请更换其他昵称重试！"
        })
      }
    }
  })
}

//用户 发送聊天消息
function handleMessageBroadcasting(socket) {
  socket.on("message",(message)=> {
    //向该房间转发该用户的信息
      socket.broadcast.to(message.room).emit("message",{
        text:nickNames[socket.id]+"："+message.text
      })
  })
}

//让用户加入已有的房间，如果没有房间，则创建一个
function handleRoomJoining(socket) {
  socket.on("join",(room)=>{
    //离开当前房间
    socket.leave(currentRoom[socket.id])
    //加入新房间，没有房间则创建新的
    joinRoom(socket,room.newRoom)
  })
}

//用户断开连接后，清空用户数据
function handleClientDisconnection(socket) {
  socket.on("disconnect",()=>{
    let nameIndex=namesUsed.indexOf(nickNames[socket.id])
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]
  })
}


