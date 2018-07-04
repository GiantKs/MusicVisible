var http = require('http');
var fs = require('fs');

var documentRoot = 'D:/webStorm/LLogin/dynamic';

var server = http.createServer(function (req, res) {
    var url = req.url;var a='text/html;charset="utf-8"';

    var file = documentRoot + url;
    if(url.indexOf("png") != -1){
        a = 'image/png';
        console.log('b');
    }

    if(file.indexOf("?") != -1){
        file='D:/webStorm/LoginLoder/index.html'
    }
    fs.readFile(file, function (err, data) {
        console.log(file);
        if (err) {
            res.writeHeader(404, {'content-type': 'text/html;charset="utf-8"'});
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
            console.log('SB');

        } else {
            var ee = new RegExp('css' , "g") ;
            if(ee.test(url)){
                a='text/css'
            }
            var dd = new RegExp('ogg' , "g") ;
            if(dd.test(url)){
                a="video/ogg";
            }
            res.writeHeader(200, {'content-type': a});
            res.write(data);
            res.end();}
    });
}).listen(8889);

console.log('服务器开启成功');


