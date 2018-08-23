//采用es6 写法
class Chat{
  constructor(socket){
    this.socket=socket
  }
  //发送消息
  sendMessage(room,text){
    let message={
      room:room,
      text:text
    }
    this.socket.emit("message",message)
  }
  //变更房间
  changeRoom(room){
    this.socket.emit("join",{
      newRoom:room
    })
  }

//  处理聊天命令
//  注意使用命令一般是 /xxx ttttt，xxx后务必要加上空格！否则无效
  processCommand(command){
    //按照command中的空格，给分成数组
    let wordsArray=command.split(" ")
    // 去掉 /
    let command=wordsArray[0].substring(1,wordsArray[0].length)
    let message=false
    switch (command){
      case "join":
        wordsArray.shift()
        //连接成字符串
        let room=wordsArray.join(" ")
        this.changeRoom(room)
        break
      case "nick":
        wordsArray.shift()
        //连接成字符串
        let name=wordsArray.join(" ")
        this.socket.emit("nameChange",name)
        break
      default:
        message="无法识别该命令"
        break
    }
    return message
  }

}

