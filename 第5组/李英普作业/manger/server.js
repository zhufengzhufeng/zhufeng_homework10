var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    mime = require('mime');
var userList = [
    {"username": "zf", "password": "11", "id": 1},
    {"username": "zz", "password": "22", "id": 2},
    {"username": "ff", "password": "33", "id": 3},

];
var server = http.createServer(function (request, responce) {
    var objUrl = url.parse(request.url, true),
        pathname = objUrl.pathname,
        query = objUrl.query,
        data = null;
    var result = '';
    var id = query['id'];
    if (pathname == '/') {
        responce.setHeader("content-type", "text/html;charset=utf8;");
        fs.createReadStream('./index.html').pipe(responce);
    } else if (pathname == '/getUsers') {
        responce.setHeader("content-type", "application/json;charset=utf8;");
        responce.end(JSON.stringify(userList));

    } else if (pathname == '/addUser') {

        request.on('data', function (data) {
            result += data;
        });
        request.on('end', function () {
            var user = JSON.parse(result);
            user.id = Math.random();
            userList.push(user);
            responce.end(JSON.stringify(userList));
        })

    } else if (pathname == '/deleteUser') {

        userList = userList.filter(function (item) {
            return item['id'] != id
        })
        responce.end(JSON.stringify(userList));


    } else if (pathname == '/curUser') {
        console.log(userList)
        userList.forEach(function (item) {
            if (item['id'] == id) {
                data = item;
            }
        })
        responce.end(JSON.stringify(data));

    } else if (pathname == '/changeUser') {
        var user = null;
        console.log(userList)
        request.on('data', function (data) {
            result += data;
        });
        request.on('end', function () {
            user = JSON.parse(result);
            userList.forEach(function (item) {
                if (item['id'] == id) {
                    item.username = user.username;
                    item.password = user.password
                }
            });

            responce.end(JSON.stringify(userList));

        });


    } else {
        fs.exists('.' + pathname, function (exists) {
            if (exists) {
                responce.setHeader("content-type", mime.lookup(pathname) + ";charset=utf8;");
                fs.createReadStream('.' + pathname).pipe(responce);
            } else {
                responce.statusCode = 404;
                responce.end('not found!')
            }
        })
    }

});
server.listen(8989, function () {
    console.log('8989 is ok!')
});