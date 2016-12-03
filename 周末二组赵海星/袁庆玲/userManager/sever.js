//node中自带一个创建服务的模块 http
var http = require('http');
var fs = require('fs');
var url = require('url');

var users = [
    {name:"lily",password:'lily',id:1},
    {name:"lucy",password:'lucy',id:2},
    {name:"Tom",password:'Tom',id:3}
];

//创建一个服务 固定的ip 和 端口号 还有请求和响应
//路由:通过不同的路径，响应不同的内容
http.createServer(function (req,res) {
    //默认访问http://localhost:8080 相当于/
    var urlObj = url.parse(req.url,true);
    var pathName = urlObj.pathname;

    //减少冗余代码
    if(pathName == '/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(pathName == '/getUsers'){
        res.end(JSON.stringify(users));
    }else if(pathName == '/addUser'){
        var result = '';

        req.on('data', function (data) {
            result += data
        });

        req.on('end', function () {
            var user = JSON.parse(result);
            user.id = Math.random();
            users.push(user);
            res.end(JSON.stringify(users));
        });

    }else if(pathName == '/delUser'){
        var _data = '';

        req.on('data', function (data) {
            _data = data
        });

        req.on('end', function () {
            var userid = JSON.parse(_data);

            users = users.filter(function(item){
                //如果返回true 删除
                return item.id != userid.id
            });

            res.end(JSON.stringify(users));
        });

    }else { // ./index.js 使用mime 类型对照表(第三方)
        //在设置之前要先判断文件是否存在，不存在 404
        fs.exists('.' + pathName, function (exists) {
            if(exists){
                res.setHeader('Content-Type',require('mime').lookup(pathName) + ';charset=utf8');
                fs.createReadStream('.' + pathName).pipe(res);
            }else{
                res.statusCode = 404;
                res.end("Not Found");
            }
        })
    }
}).listen(8080);




