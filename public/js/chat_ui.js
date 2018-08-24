//客户端初始化
$(document).ready(()=>{
  // let socket=io.connect()
  let socket=io()
  // console.log(socket)
  let chatApp=new Chat(socket)
  // console.log(chatApp)
//  显示改变名字的结果
  socket.on("nameResult",(result)=>{
    let message
    if(result.success){
      message="你已更名为「"+result.name+"」。"
    }else{
      message=result.message
    }
    $("#messages").append(credible(message))
  })

// 显示房间改变的结果
  socket.on("joinResult",(result)=>{
    // console.log(result,"joinResult")
    $("#room").text(result.room)
    $("#messages").append(credible("房间已更改！"))
  })

// 显示接收到的消息
  socket.on("message",(message)=>{
    // console.log(message)
    let newElement=$("<div></div>").text(message.text)
    $("#messages").append(newElement)
  })

// 显示可用房间列表
  socket.on("rooms",(rooms)=>{
    $("#room-list").empty()
    console.log(rooms)
    for(let room in rooms){

      // room=room.substring(1,room.length)
      if(room!==""){
        $("#room-list").append(doubtful(room))
      }
    }
    $("#room-list div").click(()=>{
      chatApp.processCommand("/join"+$(this).text())
      $("#send-message").focus()
    })
  })

//  定期请求可用房间列表
  setInterval(()=>{
    socket.emit("rooms")
    // console.log("rooms1111")
  },6000)

  $("#send-message").focus()
  $("#send-form").submit(()=>{
    processUserInput(chatApp,socket)
    return false
  })
})




//显示可疑的文本
function doubtful(message) {
  //text返回其文本内容
  return $("<div></div>").text(message)
}

//显示守信的文本（斜体显示）
function credible(message) {
  return $("<div></div>").html("<i>"+message+"</i>")
}

//处理原始输入
function processUserInput(chatApp,socket) {
  let message=$("#send-message").val()
  let systemMessage
  // /开头视为命令
  if(message.charAt(0)==="/"){
    systemMessage=chatApp.processCommand(message)
    if(systemMessage){
      $("#messages").append(credible(systemMessage))
    }
  }else{
    chatApp.sendMessage($("#room").text(),message)
    // console.log(message)
    $("#messages").append(doubtful(message))
    $("#messages").scrollTop($("#messages").prop("scrollHeight"))
  }
  $("#send-message").val("")
}
