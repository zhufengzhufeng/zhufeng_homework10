/**
 * Created by shuang on 2016/11/27.
 */
var http=require('http');
var url=require('url');
var fs=require('fs');
var users=[
    {name:'小红',password:'xiaohong',id:1},
    {name:'小兰',password:'xiaolan',id:2},
    {name:'小紫',password:'xiaozi',id:3},
];////为什么放外面就可以，放里server面就不可以
http.createServer(function (req, res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    //如果pathname是‘/’
    if(pathname=='/'){
        //res是可写流，req是可读流
        res.setHeader('Content-Type','text/html;charset=utf8;');
        ///console.log(req);
       // req.pipe(res);
        fs.createReadStream('./index.html').pipe(res);
    }else if(pathname=='/addUser'){//添加用户
        var result='';
        req.on('data', function (data) {
            //得到数据添加到users中
            result+=data;
        });
        req.on('end', function () {
            var user=JSON.parse(result);
            user.id=users[users.length-1]['id']+1;
            users.push(user);
            res.end(JSON.stringify(users));
        });
    }else if(pathname=='/getUsers'){//读取列表
        res.end(JSON.stringify(users));
    }else if(pathname=='/delete'){//删除用户
        var query=urlObj.query.id;
        users=users.filter(function (item) {
            return item.id!=query;
        });
        res.end(JSON.stringify(users));
    }else if(pathname=='/getOne'){
        //console.log(urlObj);
        //console.log(urlObj.query);
        var query=urlObj.query['id'];
        ///console.log(query);
        var user=users.find(function (item) {
            return item.id==query;
        });
        res.end(JSON.stringify(user));
    }else if(pathname=='/modify'){
        var result='';
        req.on('data', function (data) {
            result+=data;
            //找出相应id替换新的值
            var user=JSON.parse(result);//对象
            users.forEach(function (item,index) {
                if(item.id==user.id){
                    users.splice(index,1,user);
                }
            })
        });
        req.on('end', function () {
            res.end();
        });
    }else{//静态文件的情况
        fs.exists('.'+pathname,function (exists) {
            if(exists){
                res.setHeader('Content-Type',require('mime').lookup(pathname)+';charset=utf8;');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode=404;
                res.setHeader('Content-Type','text/plain;charset=utf8;');
                res.end('没有找到');
            }
        });

    }
}).listen(8081, function () {
    console.log('连接成功1');
});
