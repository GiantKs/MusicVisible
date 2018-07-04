
let  Obj = {a:1};
let  Big = {a : 9999999};

function f(proto,name,origin) {
    proto.__defineGetter__(name,()=>{
        return origin[name]
    })
}

f('Obj','',Big);

console.log(Obj.a);


let ww = {
    a:1,
    get see(){

    },
}

var p = {
    name:"chen",
    work:function() {
        console.log("wording...");
    },
    _age:18,
    get age(){
        return this._age;
    },
    set age(val) {
        if (val<0 || val> 100) {//如果年龄大于100就抛出错误
            throw new Error("invalid value")
        }else{
            this._age = val;
        }
    }
};
console.log(p.name);//输出chen