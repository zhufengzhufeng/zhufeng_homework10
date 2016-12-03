/**
 * Created by shuang on 2016/11/27.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var users={};
http.createServer(function (req, res) {

    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(pathname='/getUsers'){

    }else {
        fs.exists('.'+pathname, function (exists) {
            if(exists){
                res.setHeader('Content-Type',require('mime').lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode=404;
                res.setHeader('Content-Type','text/plain;charset=utf8');
                res.end('没找到');
            }
        })
    }
}).listen(8080);