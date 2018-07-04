let Server = require('ws').Server;
let http = require('http');
let fs = require('fs');
let server = http.createServer(function(req,res){
    fs.readFile(__dirname + '/three.html', function (err, data) {
        res.write(data);
        res.end();
    })
});
server.listen(8080);
//当new Socket实例的时候已经开始连接服务器了
let socket = new Server({server: server});


let obj=[];

socket.on('connection',function(socket){
    obj.push(socket);
    //监听客户端发过来的消息,当收到客户端消息的时候就可以执行回调函数
    socket.on('message',function(message){
        //服务器可以通过socket对象向客户端发送消息
        obj = obj.filter(i=>i.readyState!==3);
        obj.forEach((item)=>{
            if(item.readyState == 3){
                return
            }

            item.send(message);
        });console.log(obj.length);
    });
});


