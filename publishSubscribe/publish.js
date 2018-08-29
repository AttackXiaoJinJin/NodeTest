let EventEmitter=require("events").EventEmitter
let channel=new EventEmitter()
channel.clients={}
channel.subs={}
//添加 事件监听 join
channel.on("join",(id,client)=>{
  this.cilents[id]=client
  //===================================
  this.subs[id]=(senderId,message)=>{
    if(id!==senderId){
      this.clients[id].write(message)
    }
  }
  this.on("broadcast",this.subs[id])
//  =====================================
})
channel.emit("join")

//移除监听
channel.on("leave",(id)=>{
  channel.removeListener("broadcast",()=>{})
})

let net=require("net")
let server=net.createServer((socket)=>{
  socket.on("close",(data)=>{
    channel.emit("leave")
  })
}).listen(8888)






