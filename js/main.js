$(function () {
    //add为新建联系人/分组，change为编辑联系人/分组
    var CMD = null;
    //联系人ID或分组ID
    var DATA_ID = null;


    /***** 1.保证不同分辨率下footer能固定在底部 *****/

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
    };
    footerPosition();
    $(window).resize(footerPosition);


    /***** 2.处理页面 *****/

    //初始化渲染页面
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
                        alert('登录失效,请重新登录!');
                        window.location.pathname = '/index.php';
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
                        //alert('登录失效,请重新登录!');
                        window.location.pathname = '/index.php';
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
                cmd: 'list',
                num: 20,
                page: 1
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
                        //alert('登录失效,请重新登录!');
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

    //创建分组DOM
    function createGroup(groups) {
        var len = groups.length;
        for (var i = 0; i < len; i++) {
            //a.创建左边栏的分组
            var liHtml = $("<li><a href='javascript:void(0);' data-id='" + groups[i].fid + "' data-action='group'>" + groups[i].fname + "<span class='contact-num'>(" + groups[i].count + ")</span></a></li>");
            liHtml.appendTo('.dashboard-menu');
            //b.创建联系人表单的分组
            var opHtml = $("<option value='" + groups[i].fid + "'>" + groups[i].fname + "</option>");
            opHtml.appendTo('.edit-contact-group-select');
        }
    }

    //创建联系人DOM
    function createContact(contacts) {
        if (contacts.length) {
            var len = contacts.length;
            $('.nav-header span').text("(" + len + ")");
            for (var i = 0; i < len; i++) {
                var liHtml = $("<tr><th>" + (i + 1) + "</th><td><a data-id='" + contacts[i].id + "' data-action='edit-contact'>" + contacts[i].name + "</a></td><td>" + contacts[i].tele + "</td> <td>" + contacts[i].qq + "</td><td><span class='g-i'>" + contacts[i].fname + "</span></td><td><a data-id='" + contacts[i].id + "' class='edit-contact' href='javascript:void(0);' data-action='edit-contact'" + "><i class='fa fa-pencil'></i></a> &nbsp;&nbsp; <a href='#confirm-dialog' role='button' data-toggle='modal'" + " class='delete-contact' data-action='delete-contact' data-id='" + contacts[i].id + "'><i class='fa fa-trash-o'></i></a></td></tr>");
                liHtml.appendTo('.contacts-list');
            }
        }
    }


    /***** 3.处理按钮 *****/
    //参照 https://github.com/cssmagic/blog/issues/48

    //按钮事件列表
    var actionList = {
        //修改用户信息
        'change-user-info': function () {

        },
        //退出登录
        'log-out': function () {
            $.ajax({
                type: 'POST',
                url: '/api/login.php',
                dataType: 'json',
                data: {
                    cmd: 'logout',
                },
                success: function (data) {
                    switch (data.code) {
                        case 1:
                            alert('成功退出登录！');
                            window.location.pathname = '/index.php';
                            break;
                        case 2:
                            alert('退出登录失败！');
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
        },
        //新建联系人
        'new-contact': function () {
            CMD = 'add';
            //改标题
            $('.contact-editor .page-title').html('新建联系人');
            $('.contact-editor .breadcrumb .active').html('正在新建');
            //切换内容板块
            $('.contact-list').css('display', 'none');
            $('.contact-editor').css('display', 'block');
        },
        //新建分组
        'new-group': function () {
            CMD = 'add';
            //改对话框标题
            $('#edit-group-dialog #edit-group-title').html('请输入分组名');
        },
        //导出联系人
        'export': function () {

        },
        //搜索联系人
        'search': function () {

        },
        //编辑联系人
        'edit-contact': function () {
            CMD = 'change';
            //改标题
            $('.contact-editor .page-title').html('编辑联系人');
            $('.contact-editor .breadcrumb .active').html('正在编辑');
            //切换内容板块
            $('.contact-list').css('display', 'none');
            $('.contact-editor').css('display', 'block');

            //获取该联系人信息
            $.ajax({
                type: 'POST',
                url: '/api/contact.php',
                dataType: 'json',
                data: {
                    cmd: 'getone',
                    id: DATA_ID
                },
                success: function (data) {
                    switch (data.code) {
                        case 1:
                            console.log('成功获取该联系人信息');
                            //往表单填数据
                            $('#edit-contact-name').val(data.info.name);
                            $('#edit-contact-phone').val(data.info.tele);
                            $('#edit-contact-qq').val(data.info.qq);
                            $(".edit-contact-group-select").val(data.info.fenzu);
                            $('#edit-contact-email').val(data.info.email);
                            $('#edit-contact-company').val(data.info.comp);
                            $('#edit-contact-address').val(data.info.addr);
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
        },
        //删除联系人
        'delete-contact': function () {

        },
        //点击分组
        'group': function () {

        },
        //保存按钮（新建/编辑联系人底部）
        'edit-contact-submit': function () {
            //触发提交表单事件
            $('#edit-contact-form').submit();
        },
        //取消按钮（新建/编辑联系人底部）
        'edit-contact-cancel': function () {
            //弹窗询问
        },
        //保存按钮（新建/编辑分对话框）
        'edit-group-submit': function () {
            //触发提交表单事件
            $('#edit-group-form').submit();
        },
        //取消按钮（新建/编辑分对话框）
        'edit-group-cancel': function () {
            //弹窗询问
        }
    }

    //处理按钮点击事件
    $('body').on('click', '[data-action]', function () {
        //如果是编辑联系人或点击分组，则传入ID
        var dataId = $(this).attr('data-id');
        DATA_ID = (dataId == undefined) ? DATA_ID : dataId;

        var actionName = $(this).data('action');
        var action = actionList[actionName];

        if ($.isFunction(action)) action();
    })


    /***** 4.表单验证 *****/

    //新建/编辑联系人表单验证
    $('#edit-contact-form').validate({
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 12,
            },
            phone: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            qq: {
                required: true,
                digits: true,
                minlength: 5,
                maxlength: 11
            },
            group: {
                required: true,
            }
        },
        messages: {
            name: {
                required: '请填写姓名!',
                minlength: '姓名最少为2个字符',
                maxlength: '姓名最多为12个字符',
            },
            phone: {
                required: '请填写手机号!',
                digits: '请输入合法的手机号!',
                minlength: '手机号长度应该是11位',
                maxlength: '手机号长度应该是11位'
            },
            qq: {
                required: '请填写QQ号!',
                digits: '请输入合法的QQ号!',
                minlength: 'QQ号最短为5位',
                maxlength: 'QQ号最长为11位'
            },
            group: {
                required: '请选择分组!',
            }
        },
        //表单验证通过
        submitHandler: function (form) {
            console.log('校验正确,已向后台提交信息,等待后台回复');
            $.ajax({
                type: 'POST',
                url: '/api/contact.php',
                dataType: 'json',
                data: {
                    cmd: CMD,
                    name: $('#edit-contact-name').val(),
                    phone: $('#edit-contact-phone').val(),
                    qq: $('#edit-contact-qq').val(),
                    fenzu: $('.edit-contact-group-select').val(),
                    email: $('#edit-contact-email').val(),
                    addr: $('#edit-contact-address').val(),
                    comp: $('#edit-contact-company').val(),
                    id: DATA_ID
                },
                success: function (data) {
                    switch (data.code) {
                        case -1:
                            alert('分组错误，不存在此分组!');
                            break;
                        case 0:
                            alert('出错啦!');
                            console.log('写入数据库失败');
                            break;
                        case 1:
                            alert('保存成功！');
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

    //新建/编辑分组表单验证
    $('#edit-group-form').validate({
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
                    cmd: CMD,
                    name: $('#edit-group-input').val()
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



    //删除联系人
    function delContact() {
        $.ajax({
            type: 'POST',
            url: '/api/contact.php',
            dataType: 'json',
            data: {
                cmd: 'delete',
                id: delId
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


    //删除联系人
    $('#myModal .btn-danger').click(function () {
        console.log('用户确定删除');
        delContact();
    })

    setTimeout(function () {
        //检测用户点击了哪一个删除按钮
        $('.contacts-list .delete-contact').click(function () {
            delId = $(this).parent().attr('contact-id');
        })
    }, 2000)

    //搜索
    $('.search-well .btn').click(function () {
        console.log('sss')
        var str = $(this).val();
        $.ajax({
            type: 'POST',
            url: '/api/contact.php',
            dataType: 'json',
            data: {
                cmd: 'search',
                any: str
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


    init();
});

