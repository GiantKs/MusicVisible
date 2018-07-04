var obj={a:1,b:2}


console.log(Object.assign(obj, {b: 3}));

delete obj.a
console.log(obj);