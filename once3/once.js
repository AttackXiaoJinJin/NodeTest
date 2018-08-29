let net=require("net")
let server=net.createServer((socket)=>{
  socket.once("data",(data)=>{
    console.log(data)
    socket.write(data)
  })
}).listen(8888)



