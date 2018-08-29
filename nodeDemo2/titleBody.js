let http=require("http")
let fs=require("fs")

http.createServer((request,result)=>{
  if(request.url==='/'){
    fs.readFile("./title.json",(error,data)=>{
      if(error){
        handelError(result)
      }else{
        let title=JSON.parse(data.toString())
        fs.readFile(".body.html",(error,data)=>{
          if(error){
            handelError(result)
          }else{
            let body=data.toString()
            let html=body.replace("%",title.join("<h1></h1>"))
            result.writeHead(200,{"Content-Type":"text/html"})
            result.end(html)
          }
        })
      }
    })
  }
}).listen(8000,"127.0.0.1")

function handelError(result){
  result.end("Server Error")
  return 
}



