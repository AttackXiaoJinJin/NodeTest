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
  channel.removeAllListeners("broadcast",()=>{})

})

let net=require("net")
let server=net.createServer((socket)=>{
  socket.on("close",(data)=>{
    channel.emit("leave")
  })
}).listen(8888)

let events=require("events")
let myEmitter=new events.Emitter()
myEmitter.on("error",(error)=>{
  console.log("ERROR:"+error.message)
})
myEmitter.emit("error",new Error("出错啦！"))
//============================================
let events=require("events")
let myEmitter=new events.Emitter()
myEmitter.on("data",()=>{
  //返回broadcast监听事件的长度，即用户人数
  let length=this.listeners("broadcast").length
})
