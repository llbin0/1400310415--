var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var db_handle = require('../function/realize');  /*引入出来数据模块*/


/* 进入主页面. */
router.get('/', function(req, res, next) {
  /*res.render表示调用homr模板文件，并把参数title传到模板文件中
    在app.js文件中设置了模板为ejs 所以这个找的是view下的home.ejs
  */
  res.render('home', { title: 'LLBMs' });
});

/*设置进入登陆界面的路由*/
router.get('/login', function(req, res, next) {
    res.render('login', { title: '登陆' });
});

/*设置进入注册界面的路由*/
router.get('/register', function(req, res, next) {

    res.render('register', { title: '注册' });
});
//管理员登陆界面
router.get('/admin',function(req, res, next) {
    res.render('admin_login', { title: 'admin' });
});
// 管理员主页
router.get('/system',function(req, res, next) {
    console.log(req.session.user);
    for (var i in req.session.user) {
        if (req.session.user[i] === "admin") {
            console.log("登陆了的用户：" + req.session.user[i]);
            res.render('system', { title: "admin" });
            break;
        } else {
            console.log("没有用户");
        }
    }
    res.render('err', { title: 404 });
});

/*设置进入用户界面的路由*/
router.get('/user/:id', function(req, res){
    for (var i in req.session.user) {
        if (i === req.params.id) {
            res.render('users', { title: req.params.id });
            break;
        }
    }
    res.render('err', { title: 404 });

});

/*添加用户*/
router.post('/register', db_handle.addUser);

/*设置查找已注册账号的路由*/
router.get('/User/:id', db_handle.searchUser);

/*设置登陆接口的路由*/
router.post('/signin',db_handle.signIn);

/*设置管理员登陆接口的路由*/
router.post('/admin_signin',db_handle.admin_signIn);

/*上传笔记*/
router.post('/note',db_handle.postMessage);
//获取所有笔记
router.get('/notes',db_handle.getAllMessages);
// 删除笔记
router.delete('/notes/:id',db_handle.deleteMessage);
// 添加留言
router.put('/notes/:id',db_handle.addMessage);
// 注销用户
router.get('/logout/:id',function(req, res, next) {
    try {
        for (var i in req.session.user) {
            if (i === req.params.id) {
                console.log("注销了的用户：" + req.session.user[i]);
                req.session.user[i]="";
                return res.send("http://localhost:3000/");
                break;
            }
        }
    } catch (err) {
        res.render('home', { title: 'home' });
    }

});
module.exports = router;
