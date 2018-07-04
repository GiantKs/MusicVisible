/*
var ary=[{a:1},2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53]
var obj={a:1}
console.log(ary.slice(0,50 ));
.slice(0,50 )*/

/*var num = '0.07000000000000000001';

function retainTwo(num){
    if(isNaN(num*100)){
    console.error('Parameters are not specified input.');return 0;}
    return( Math.round(num*100)/100)}


console.log(undefined!==undefined);*/


/*
function f(a=1) {
    return a

}

console.log(f(3));*/
/*let rng={a:1,b:2}

console.log(Object.entries(rng));
console.log(Object.values(rng));
console.log(Object.keys(rng));*/


/*async fetchData(query) => {
    try {
        const response = await  f() {
            setTimeout(()=>{
                if(Math.random()>0.5){
                    return 23
                }else{
                    console.error(11)
                }

            },3000)
        }
    } catch (error) {
        console.log(error)
    }
}
fetchData(query).then(data => {
    Log.error('东边')
})*/



/*console.log(Object.hasOwnProperty('create'));
var cc = Object.create({a:1,b:2})
console.dir(cc.__proto__);
console.log(cc.a);*/

/*let red = {lisong:8};
console.log(Object.getOwnPropertyDescriptor(red,'lisong'));*/

/* async function rng(res,rej) {
    setTimeout(()=>{
        res()
    },3000)
}

console.log(rng(() => {
    console.log('SB');
}));*/
/*
var rng =  ()=>{
    setTimeout(()=>{

    },3000)
    return 'hh'
};
console.log(rng());*/
/*=====================================*/
/*function asyncGet (x) {
    return new Promise(resolve => setTimeout(() => {
        console.log('a')
        resolve(x)
    }, 500))
}

async function test () {
    console.log('b')
    const x = 3 + 5
    console.log(x)

    const a = await asyncGet(1)
    console.log(a)

    const b = await asyncGet(2)
    console.log(b)

    console.log('c')
    return a + b
}

const now = Date.now()
console.log('d')
test().then(x => {
    console.log(x)
    console.log(`elapsed: ${Date.now() - now}`)
})
console.log('f')*/
/*=================================*/

/*async function f() {
    await setTimeout(()=>{
        console.log('SB');
    },5000);
    console.log('Rng');
}

f();*/


/*
let fn = ()=>{};
let fn1 = ()=>{};
let hh = new Promise(fn,fn1)
hh.then(()=>{

})
*/

/*
function Person(name,age) {
    this.name=name;
    this.age=age;
    console.log(this,'s');
}
/!*定义一个学生类*!/
function Student(name,age,grade) {
    Person.apply(this,arguments);
    this.grade=grade;
}
Student(1,2,3)*/

/*let str = 'sb';
let ary=[1,2,3];
let rng = (a)=>{
    return String.fromCharCode(a)
};
let royal = (r,f)=>{
    if(f){
       return rng(r.charCodeAt(0));
    }  else{
       return r.charCodeAt(0);
    }

};
let log =  str.charCodeAt(1);
console.log(log,rng(101));

ary.sort(function (a,b) {
    var a = null;
    a = a < b ? -1 : a > b ? 1 : 0
    console.log(a);
    return a
})

console.log(ary);



if(!6){

}
console.log(!123);*/


let rng=[false,1,2,false,false,false];
let   count=0;
rng.forEach((item,index)=>{
    count +=item
});

console.log(count);
var r=rng.map((item,index)=>{
    return 6
});

console.log(rng,r);


console.log( 0 + false );

console.log(Number(this));

if(rng.filter(i => i == 6).length == 0){
    console.log('sss');
}


