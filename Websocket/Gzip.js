var gzip = require('gzip-js'),
    options = {
        level: 3,
        name: 'hello-world.txt',
        timestamp: parseInt(Date.now() / 1000, 10)
    };

// out will be a JavaScript Array of bytes
var out = gzip.zip('Hello world', options);
console.log(out);