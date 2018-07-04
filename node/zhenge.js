function Ryl(uzi) {
    if(uzi.indexOf('?')!== -1){
        return '&'
    }else{
        return '?'
    }
}

console.log(rng('http://localhost:63342/LLogin/dynamic/index.html?_ijt=nj4roir5j4rs8jculma9mnpo05'));