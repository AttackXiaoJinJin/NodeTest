//显示可疑的文本
function doubtful(message) {
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
    $("#messages").append(doubtful(message))

  }


}
