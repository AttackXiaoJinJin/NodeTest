function a(callback) {
  setTimeout(callback,200)
}
//注意！要加 ; 分号的情况很少，这算一个！
//当下一行代码以()或[]开头的时候！！
let color="blue";

//由于异步，所以先执行 color="red"
// a(()=>{
//   console.log(color)
// })

//使用闭包“冻结” color 的值
((color)=>{
  a(()=>{console.log(color)})
})(color)

color="red"





