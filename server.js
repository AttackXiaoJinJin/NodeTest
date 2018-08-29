//提供HTTP服务端和客户端功能
let http=require("http")
//提供文件系统功能
let fs=require("fs")
//提供文件系统路径功能
let path=require("path")
//根据文件扩展名得出MIME类型
let mime=require("mime")
let cache={}
//创建 HTTP 服务器
let server=http.createServer((request,response)=>{
  let filePath=false
  if(request.url==='/'){
    filePath='public/index.html'
  }else{
    filePath='public'+request.url
  }
  let absPath='./'+filePath
  //返回静态文件
  serveStatic(response,cache,absPath)

//启动 http 服务器
//param:端口，callback
}).listen(3000,()=>{
  console.log("服务器已启动")
})

// server
//加载一个Socket.IO
let charServer=require("./lib/chat_server")
charServer.listen(server)

//404
function send404(response) {
  response.writeHead(404,{"Content-Type":"text/plain"})
  response.write("Ooops,找不到页面啦！")
  response.end()
}
//发送文件
function sendFile(response,filePath,fileContents) {
  // response.writeHead(200,{"Content-Type":mime.lookup(path.basename(filePath))})
  response.writeHead(200,{"Content-Type":mime.getType(path.basename(filePath))})
  response.end(fileContents)
}
//静态文件处理
function serveStatic(response,cache,absPath) {
  //如果文件缓存在内存中，则从内存中返回文件
  if(cache[absPath]){
    sendFile(response,absPath,cache[absPath])
  }else{
    fs.exists(absPath,(exists)=>{
      if(exists){
        fs.readFile(absPath,(err,data)=>{
          if(err){
            send404(response)
          }else{
            //存进内存中
            cache[absPath]=data
            sendFile(response,absPath,data)
          }
        })
      }else{
       send404(response)
      }
    })
  }
}






