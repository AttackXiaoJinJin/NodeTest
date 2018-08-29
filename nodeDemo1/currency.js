//返回一个对象，对象包含两个方法========

let a=1
function oneToTwo() {
  console.log("222")
}
function oneToThree() {
  console.log("333")
}
// exports.oneToTwo=oneToTwo
// exports.oneToThree=oneToThree
exports=oneToTwo
//=====================================

//返回一个构造函数，里面有两个方法（函数）
// class Currency{
//   constructor(a){
//     this.a=a
//   }
//   oneToTwo() {
//       console.log("222")
//     }
//   oneToThree() {
//       console.log("333")
//     }
//
//
// }
//不能写exports=Currency
//而是用module.expotrs=Currency
// module.exports=Currency













