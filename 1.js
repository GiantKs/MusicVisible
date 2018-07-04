console.log((Math.round(135.8)+4)/100);



function getget() {
    return new Promise(function (res,rej) {
        var xhr = new XMLHttpRequest();
        xhr.open('get','./1.js')
        xhr.onreadystatechange=function() {
            if (xhr.readyState==4 && xhr.status==200) {
                res(xhr.responseText)
            }else{
                rej('sb')
            }
        }
        xhr.send()
    })
}
getget().then(function (data) {
    console.log(data);
})




/*Object.entries()*/
