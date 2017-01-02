var delId = null;

//保证不同分辨率下footer能固定在底部
$(function () {
    //设置主内容窗口最小高度min-height
    var h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    h = h - $(".navbar").height() - $("footer").height();
    $(".content").css("min-height", h);

    //判断主内容高度与窗口高度的大小
    function footerPosition() {
        $("footer").removeClass("fixed-bottom");
        var contentHeight = document.body.scrollHeight,//网页正文全文高度
            winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
        if (!(contentHeight > winHeight)) {
            //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
            $("footer").addClass("fixed-bottom");
        } else {
            $("footer").removeClass("fixed-bottom");
        }
    }

    footerPosition();
    $(window).resize(footerPosition);
});

function createGroup(data) {
    var len = data.length;
    for (var i = 0; i < len; i++) {
        var liHtml = $("<li><a href='#'" + " fid='" + data[i].fid + "'" + ">" + data[i].fname + "<span class='contact-num'>(" + data[i].count + ")</span></a></li>");
        //var liHtml = $("<li><a href='#'" + " fid='" + data[i].fid + "'" + ">" + data[i].fname + "</a></li>");
        liHtml.appendTo('.dashboard-menu');
    }
}

function createContact(data) {
    var len = data.length;
    $('.nav-header span').text("(" + len + ")");
    for (var i = 0; i < len; i++) {
        var liHtml = $("<tr><th>" + (i + 1) + "</th><td><a href='edit-contact.html?id="+ data[i].id +"'>" + data[i].name + "</a></td><td>" + data[i].tele + "</td> <td>" + data[i].qq + "</td> <td><span class='g-i'>" + data[i].fname + "</span></td> <td" + " contract-id='" + data[i].id + "'" + "> <a href='edit-contact.html?id="+ data[i].id +"'" + " class='edit-contact'" + "><i class='fa fa-pencil'></i></a> &nbsp;&nbsp; <a href='#myModal' role='button' data-toggle='modal'" + " class='delete-contact'" + "><i class='fa fa-trash-o'></i></a> </td> </tr>");
        liHtml.appendTo('.contacts-list');
    }
}

function init() {
    //获取当前用户信息
    $.ajax({
        type: 'POST',
        url: '/api/login.php',
        dataType: 'json',
        data: {
            cmd: 'islogin'
        },
        success: function (data) {
            switch (data.code) {
                case 0:
                    console.log('未登录')
                    break;
                case 1:
                    console.log('获取用户信息成功');
                    $('#username').text(data.info.username);
                    break;
                case 2:
                    console.log('查询失败');
                    break;
                default:
                    console.log('遇到未知错误--' + data.code + data.msg);
                    break;
            }
        },
        error: function () {
            console.log('请求出错')
        }
    });

    //获取全部分组
    $.ajax({
        type: 'POST',
        url: '/api/tag.php',
        dataType: 'json',
        data: {
            cmd: 'getalltag'
        },
        success: function (data) {
            switch (data.code) {
                case 1:
                    console.log('获取分组成功');
                    //创建分组DOM
                    createGroup(data.info);
                    break;
                case -6:
                    alert('登录失效,请重新登录!');
                    window.location.pathname = '/index.php'
                    console.log(data.msg);
                    break;
                default:
                    console.log('获取分组时遇到未知错误--' + data.code + data.msg);
                    break;
            }
        },
        error: function () {
            console.log('请求出错')
        }
    });

    //获取全部联系人信息
    $.ajax({
        type: 'POST',
        url: '/api/contact.php',
        dataType: 'json',
        data: {
            num: 20,
            page: 1,
            cmd: 'list'
        },
        success: function (data) {
            switch (data.code) {
                case 0:
                    alert('当前请求页数超过总页数!');
                    break;
                case 1:
                    console.log('获取联系人成功');
                    //创建联系人DOM
                    createContact(data.info);
                    break;
                case -6:
                    alert('登录失效,请重新登录!');
                    window.location.pathname = '/index.php'
                    console.log(data.msg);
                    break;
                default:
                    console.log('获取联系人时遇到未知错误' + data.code + data.msg);
                    break;
            }
        },
        error: function () {
            console.log('请求出错')
        }
    });
}

$(document).ready(function () {
    init();

    //新建联系人按钮点击
    $('#new-contact').click(function () {
        window.location.pathname = '/new-contact.html';
    });

    //新建分组表单验证
    $('#new-group-form').validate({
        rules: {
            newGroupName: {
                required: true,
                minlength: 1,
                maxlength: 8,
            }
        },
        messages: {
            newGroupName: {
                required: '请填写分组名!',
                minlength: '分组名最少为1个字符',
                maxlength: '分组名最多为8个字符',
            }
        },
        //分组表单验证通过
        submitHandler: function (form) {
            console.log('校验正确,已向后台提交信息,等待后台回复');
            $.ajax({
                type: 'POST',
                url: '/api/tag.php',
                dataType: 'json',
                data: {
                    name: $('#new-group-input').val(),
                    cmd: 'add'
                },
                success: function (data) {
                    switch (data.code) {
                        case -1:
                            alert('已存在相同分组名称!');
                            break;
                        case 0:
                            alert('出错啦!');
                            console.log('写入数据库失败');
                            break;
                        case 1:
                            alert('成功新建分组名');
                            window.location.pathname = '/contact.html';
                            break;
                        default:
                            alert('出错啦!');
                            console.log('遇到未知错误--' + data.code + data.msg);
                            break;
                    }
                },
                error: function () {
                    alert('出错啦!');
                    console.log('请求出错')
                }
            });

            //阻止表单提交
            return false;
        },
        //表单验证不通过
        invalidHandler: function (event, validator) {
            alert('您的输入有误,请重新填写.')
            console.log('输入有误,无法向后台提交信息,提示用户重新填写')
            //阻止表单提交
            return false;
        }
    });

    //新建分组提交按钮
    $('#new-group-submit').click(function () {
        //应该先验证后提交
        $('#new-group-form').submit();
    });

    //导出
    $('#export').click(function () {

    });

    //删除联系人
    $('#myModal .btn-danger').click(function () {
        console.log('用户确定删除');
        delContact();
    })

    setTimeout(function () {
        //检测用户点击了哪一个删除按钮
        $('.contacts-list .delete-contact').click(function () {
            delId = $(this).parent().attr('contract-id');
        })
    }, 2000)

    $('.search-well .btn').click(function() {
        console.log('sss')
        var str = $(this).val();
        $.ajax({
            type: 'POST',
            url: '/api/contact.php',
            dataType: 'json',
            data: {
                any: str,
                cmd: 'search'
            },
            success: function (data) {
                switch (data.code) {
                    case 0:
                        alert('出错啦')
                        console.log('当前请求页数超过总页数')
                        break;
                    case 1:
                        console.log('成功');
                        break;
                    default:
                        console.log('遇到未知错误--' + data.code + data.msg);
                        break;
                }
            },
            error: function () {
                console.log('请求出错')
            }
        });
        window.location.pathname = '/search.html';
    })

});

function delContact() {
    $.ajax({
        type: 'POST',
        url: '/api/contact.php',
        dataType: 'json',
        data: {
            id: delId,
            cmd: 'delete'
        },
        success: function (data) {
            switch (data.code) {
                case -2:
                    alert('出错啦')
                    console.log('权限错误')
                    break;
                case -1:
                    alert('出错啦')
                    console.log('不存在此人')
                    break;
                case 0:
                    alert('出错啦')
                    console.log('数据库写入错误')
                    break;
                case 1:
                    console.log('删除成功');
                    break;
                default:
                    console.log('遇到未知错误--' + data.code + data.msg);
                    break;
            }
        },
        error: function () {
            console.log('请求出错')
        }
    });
     window.location.pathname = '/contact.html';
}
