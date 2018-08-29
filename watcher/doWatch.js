let events=require("events")
let util=require("util")
let fs=require("fs")
let watchDir="./watch"
let proDir="./done"
class Watcher{
  constructor(watchDir,proDir){
    this.watchDir=watchDir
    this.proDir=proDir
  }
  watch(){
    let watcher=this
    console.log("33333")
    fs.readdir(this.watchDir,(error,files)=>{
      if(error) throw error
      for(let index in files){
        watcher.emit("bigCase",files[index])
      }
    })
  }
  start(){
    console.log("22222",this.watchDir)
    let watcher=this
    //注意！！只有当新建或重命名文件的时候才会触发！！
    fs.watchFile(this.watchDir,()=>{
      console.log("55555")
      watcher.watch()
    })
  }


}

//watchDir 要监控的目录，proDir 要修改的文件的目录
// function Watcher(watchDir,proDir) {
//   this.watchDir=watchDir
//   this.proDir=proDir
// }
//继承事件发射器行为
util.inherits(Watcher,events.EventEmitter)
// Watcher.prototype=new events.EventEmitter()
console.log("44444")
//扩展发射器
// let fs=require("fs")
// let watchDir="./watch"
// let proDir="./done"
//扩展 Watcher 方法

//读取文件，并发送 bigCase 事件
// Watcher.prototype.watch=()=>{
//   let watcher=this
//   fs.reddir(this.watchDir,(error,files)=>{
//     if(error) throw error
//     for(let index in files){
//       watcher.emit("bigCase",files[index])
//     }
//   })
// }
//监控文件
// Watcher.prototype.start=()=>{
//   let watcher=this
//   fs.watchFile(watchDir,()=>{
//     watcher.watch()
//   })
// }
//==================================
let watcher=new Watcher(watchDir,proDir)
watcher.on("bigCase",(file)=>{
  console.log("11111",watcher)
  let watchFile=watcher.watchDir+"/"+file
  let proFile=watcher.proDir+"/"+file.toUpperCase()
  console.log(watchFile,proFile)
  //rename会把之前文件夹watchFile里所有的文件全部转移到新文件夹proFile中，并且文件名全部大写
  fs.rename(watchFile,proFile,(error)=>{
    if(error) throw error
  })
})

watcher.start()
// new Watcher(watchDir,proDir).start()




