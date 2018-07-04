let ary={};
let addEveventLiKs=function (type,cb) {
    if(!ary[type]){
        ary[type]=[];
        ary[type].push(cb)
    }else{
        ary[type].push(cb)
    }
};
let dispatch=function (data) {
    if(ary[data.type]){
        ary[data.type].forEach(function (i) {
            i(data)
        })
    }
};
let dispathRemove = function (name) {
    if(ary[name]){
        ary[name]=[]
    }
};
function f1(Event) {
    console.log(1,Event);
}

function f2(Event) {
    console.log(6,Event);
}

addEveventLiKs('a',f1);
addEveventLiKs('a',f2);
dispatch({type:'a',message:{data:'我不知道对不对，我只知道我特别的'}});
dispathRemove('a');
dispatch({type:'a',message:{data:'LIke'}});
/*---------------------------------------------------*/

emerge 浮现 暴露
status  地位
intermediate 中间的
presence 存在
appliance 用具，器具
emergency 突发情况，紧急情况



