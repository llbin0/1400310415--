var db_conf = require('./sql_con');
var connection = db_conf.getConnection();
var hadLogin = false;
var loginUser = "";
var loginPassword = "";


exports.putData = function (req, res) {

    var sql = "update user set Password='" + req.body.Password + "' where User='" + req.params.id + "'";
    connection.query(sql, function (err, result) {
    });
    return res.send("PUT API: " + req.params.id + " : " + req.body.Password);

}
//删除数据
exports.deleteData = function (req, res) {
    var sql = "delete from User where User='" + req.params.id + "'";
    connection.query(sql, function (err, result) {
    });
    return res.send("DELETE API");
}
//向数据库查询用户正确则返回用户页面地址
exports.signIn = function (req, res, next) {
    var sql = "select * from user where User=" + "'" + req.body.User + "'" + " and Password=" + "'" +req.body.Password + "'";
    var user={};

    if (req.session.user == null) {
        req.session.user={};
    }

    connection.query(sql, function (err, rows, fields) {
        /*rows为查询出的数据，可通过rows[i].字段 访问数据*/
        if (rows.length > 0) {
            loginUser = req.body.User;
            req.session.user[loginUser] = loginUser;
            return res.send("http://localhost:3000/user/" + req.body.User);
        } else {
            return res.send("账号或密码错误");
        }
    })
}
//向数据库查询管理员正确则返回用户页面地址
exports.admin_signIn = function (req, res, next) {

    var sql = "select * from admin where ID=" + "'" + req.body.User + "'" + " and Password=" + "'" +req.body.Password + "'";

    if (req.session.user == null) {
        req.session.user={};
    }

    connection.query(sql, function (err, rows, fields) {
        if (rows.length > 0) {
            hadLogin = true;
            loginUser = req.body.User;
            req.session.user["admin"] = "admin";
            return res.send("http://localhost:3000/system");
        } else {
            return res.send("账号或密码错误");
        }
    })
}
//查询用户并返回成功与否代表值
exports.searchUser = function (req, res) {
    var sql = "select * from user where User=" + "'" + req.params.id + "'";
    connection.query(sql, function (err, rows, fields) {
        if (rows.length) {
            return res.send("1");
        } else {
            return res.send("0");
        }
    })
};
//插入注册账号后返回登陆界面网址
exports.addUser = function (req, res) {
    var sql = "insert into user(User,Password) values('" + req.body.User + "','" + req.body.Password + "')";
    connection.query(sql, function (err, result) {
        return res.send("http://localhost:3000/login");
    });
};

/*上传笔记*/
exports.postMessage = function (req, res) {
    var note = req.body.Ms.replace("'","''");
    var sql = "insert into notes(User,Ms,Mtime,Hide,Pass) values('" + req.body.User + "','" + note + "','" + req.body.Mtime + "'," + req.body.Hide +"," + req.body.Pass+ ")";
    connection.query(sql, function (err, result) {
        return res.send("留言成功！");
    });
};
/*查看全部笔记*/
exports.getAllMessages = function (req, res) {
    var sql = "select * from notes order by Mtime desc";
    connection.query(sql, function (err, rows, fields) {
        res.send(JSON.stringify(rows));
    });
};

/*删除笔记*/
exports.deleteMessage = function (req, res) {
    var sql = "delete from notes where N=" + req.params.id + "";
    connection.query(sql, function (err, result) {
        return res.send("删除成功！");
    });
};

/*添加笔记*/
exports.addMessage = function (req, res) {
    var sql = "update notes set Pass=2" + " where N='" + req.params.id+"'";
    connection.query(sql, function (err, result) {
        return res.send("添加成功");
    });
};
// 修改登陆状态
exports.changeLoginState = function () {
    hadLogin = false;
    loginUser = "";
}
