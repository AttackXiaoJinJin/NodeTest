let net=require("net")
let server=net.createServer((socket)=>{
  socket.on("data",(data)=>{
    socket.write(data)
  })
})
server.listen(8888)


