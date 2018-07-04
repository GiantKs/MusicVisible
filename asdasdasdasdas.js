let obj = {a:{curpage:3},b:{cur:2}};

/*
console.log(Object.values(obj).forEach((item)=>{
    item.curpage = 1;
}));
console.log(obj);*/

/*var ary  = []
console.log('cee');
for(var i= 0 ;i<100000000;i++){ary.push(i)}
console.log(1);*/
var obj1 = Object.assign(obj,{}, obj, {b: 6});

console.log(obj === obj1 );
