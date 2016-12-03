var fs = require('fs');
//创建目录必须保证父级存在，不存在无法创建
//fs.mkdirSync('a/b/c/d');
//异步创建 循环创建需要递归
/*fs.mkdir('a',function(err){
    //是否成功
    console.log(err)
});*/

//同步创建目录
function mkdirPathSync(path){
    var arr = path.split('/');
    for(var i = 0; i < arr.length;i++){
        //每次截取想要创建的路径
        var currpath = arr.slice(0,i+1).join('/');

        //如果文件已经存在，就不需要创建
        if(!fs.existsSync(currpath)){
            fs.mkdirSync(currpath);
        }

    }
}
//mkdirPathSync('fs/a/b/c/f/e');

//作业：异步创建目录
/*
* path : 路径
* index : 路径层数索引值
* */
function mkdirPath(path,index){
    var arr = path.split('/');
    var currpath = arr.slice(0,index).join('/'); //获取当前路径

    fs.mkdir(currpath,function(err){
        //console.log(currpath,err);
        if(index < arr.length){
            index++;
            mkdirPath(path,index);
        }
    });
}

mkdirPath('fs/a/b/c/x/e',1);