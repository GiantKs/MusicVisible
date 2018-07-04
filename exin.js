/*
var obj='5';
var number=0.2333

console.log(Number(obj));

var num = 22.123456;

console.log(num.toFixed(2));*/


/*
console.log(false === undefined);

console.log('' - 1);*/

/*
let a ={rng:1,c:2}
console.log(a);
a.c=3;
console.log(a);
a.rng=6;
console.log(a);


console.log(a.bbb===1);*/
/*


let ary =[{id:1,num:2}];*/




/*function IChange(oldAry,changeFlag,changetype,changeVal) {
    let oldAryIndex = oldAry.findIndex((item, index) => {
        return item.id === changeFlag
    });
    if(oldAryIndex === -1){return oldAryIndex}
    let cloneAry = JSON.parse(JSON.stringify(oldAry));
    console.log(cloneAry[oldAryIndex]['rng'][changetype]);
    cloneAry[oldAryIndex]['rng'][changetype] = changeVal;
    return cloneAry
}

console.log(IChange(ary, 2, '8', true));*/


/*console.log(ary.filter((item, index) => {
    return index !== 0
}));*/

/*console.log(typeof 1 !== 'number');*/

let a={1:2}



let o = {a:{role:1},b:{role:2},c:{role:3},d:{role:2},"1":5};
/*let ary = [];let allobj={};
for(let i in o){
    if(o[i]['role']!== undefined && !ary.includes(o[i]['role'])){
        ary.push(o[i]['role'])
    }
}
ary.forEach((item)=>{
    allobj[item]={}
});
for(let key in o){
    ary.forEach((item)=>{
        if(o[key]['role'] ===  item){
            allobj[item][key] = Object.assign({},o[key])
        }
    })
}*/
/*delete o.a;*/
o.a.role=5
console.log(o);
/*
console.log(allobj);*/
console.log(o.hasOwnProperty('1'));

let c=1
let obj = {c}
console.log(obj,556);





