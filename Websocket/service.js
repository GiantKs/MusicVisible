var http = require('http');
var fs = require('fs');
var server = http.createServer(function(request, response){

   var data =  `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<style>
    div{
        margin: 100px auto;
        width: 600px;
        height: 1000px;
        overflow: auto;
    }

</style>
<body>
<div id="div">

</div>
</body>
</html>
<script>
    var ws = new WebSocket("ws://192.168.1.228:8080");
    ws.onmessage = function(evt) {
        console.log(evt);
        var element = document.createElement("li");
        element.innerText= evt.data;
        div.appendChild(element);
    };
</script>`;


        response.end(data)

});
server.listen(7777)