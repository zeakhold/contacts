$(function () {
    //add为新建联系人/分组，change为编辑联系人/分组
    var CMD = null;
    //联系人ID或分组ID
    var DATA_ID = null;

    /***** 1.页面处理函数部分 *****/

    //初始化渲染页面
    function render() {
        //动态调节主内容窗口高度
        var h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
        h = h - $(".navbar").height();
        $(".content").css("min-height", h);

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
                        createContact(data.info, 1);
                        //创建分页DOM
                        createPagination(data.max_page);
                        //填写总联系人数
                        $('#contact-count').text("(" + data.count + ")");
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

        bindEvent();
        bindValidate();
    }

    //创建分组DOM
    function createGroup(groups) {
        var len = groups.length;
        for (var i = 0; i < len; i++) {
            //a.创建左边栏的分组
            var liHtml = $("<li><a href='javascript:void(0);' data-id='" + groups[i].fid + "' data-action='group'>" + groups[i].fname + "<span class='contact-num'>(" + groups[i].count + ")</span></a></li>");
            liHtml.appendTo('.dashboard-menu');
            //b.'新建联系人表单'的分组下拉项
            var opHtml = $("<option value='" + groups[i].fid + "'>" + groups[i].fname + "</option>");
            opHtml.appendTo('.edit-contact-group-select');
        }
    }

    //创建联系人DOM
    function createContact(contacts, page) {
        //先清空页面
        $('.contacts-list').html('');
        if (contacts != null || contacts != undefined || contacts != '') {
            var len = contacts.length;
            for (var i = 0; i < len; i++) {
                var trHtml = $("<tr><th>" + ((page - 1) * 20 + i + 1) + "</th><td><a data-id='" + contacts[i].id + "' data-action='edit-contact'>" + contacts[i].name + "</a></td><td>" + contacts[i].tele + "</td> <td>" + contacts[i].qq + "</td><td><span class='g-i'>" + contacts[i].fname + "</span></td><td><a data-id='" + contacts[i].id + "' class='edit-contact' href='javascript:void(0);' data-action='edit-contact'" + "><i class='fa fa-pencil'></i></a> &nbsp;&nbsp; <a href='javascript:void(0);' role='button' data-toggle='modal'" + " class='delete-contact' data-action='delete-contact' data-id='" + contacts[i].id + "'><i class='fa fa-trash-o'></i></a></td></tr>");
                trHtml.appendTo('.contacts-list');
            }
        }
    }

    //创建分页DOM
    function createPagination(pageCount) {
        if (pageCount != null || pageCount != undefined || pageCount != '') {
            $("<li><a href='javascript:void(0)' data-action='pre-page'>«</a></li>").appendTo('.pagination');
            for (var i = 1; i <= pageCount; i++) {
                if (i == 1) {
                    var liHtml = $("<li class='page-number active'><a href='#' data-action='page-number' data-id='" + i + "'>" + i + "</a></li>");
                } else {
                    var liHtml = $("<li class='page-number'><a href='#' data-action='page-number' data-id='" + i + "'>" + i + "</a></li>");
                }
                liHtml.appendTo('.pagination');
            }
            $("<li><a href='javascript:void(0)' data-action='next-page'>»</a></li>").appendTo('.pagination');
        }
    }

    //退出登录
    function handleLogout() {
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
    }

    //搜索联系人
    function handleSearchContact() {
        //确保内容板块在列表页
        $('.main-content').css('display', 'block');
        $('.contact-editor').css('display', 'none');

        var str = $.trim($('#search-text').val());
        if (str == '') {
            alert('输入不能为空！');
            return false;
        }
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
                        alert('出错啦');
                        console.log('当前请求页数超过总页数')
                        break;
                    case 1:
                        console.log('搜索联系人成功');
                        //判断有没有联系人
                        if (data.info == null || data.info == undefined || data.info == '') {
                            alert('找不到匹配的联系人');
                        } else {
                            //创建联系人DOM
                            createContact(data.info, 1);
                        }
                        break;
                    default:
                        alert('出错啦');
                        console.log('遇到未知错误--' + data.code + data.msg);
                        break;
                }
            },
            error: function () {
                alert('出错啦!');
                console.log('请求出错');
            }
        });
    }

    //编辑联系人
    function handleEditContact() {
        CMD = 'change';
        //改标题
        $('.contact-editor .page-title').html('编辑联系人');
        $('.contact-editor .breadcrumb .active').html('正在编辑');
        //切换内容板块
        $('.main-content').css('display', 'none');
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
    }

    //删除联系人
    function handleDeleteContact() {
        //其实应该添加一步确认操作，这里偷懒直接删除:）
        $.ajax({
            type: 'POST',
            url: '/api/contact.php',
            dataType: 'json',
            data: {
                cmd: 'delete',
                id: DATA_ID
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
                        alert('删除成功!');
                        window.location.pathname = '/contact.html';
                        break;
                    default:
                        alert('出错啦')
                        console.log('遇到未知错误--' + data.code + data.msg);
                        break;
                }
            },
            error: function () {
                console.log('请求出错')
            }
        });
    }

    //分页操作
    function handlePageSwitch(toPage) {
        var pageNumbers = $('.page-number');
        var pageCount = pageNumbers.length;
        if (toPage > 0 && toPage <= pageCount) {
            //修改激活的当前页码
            for (var i = 1; i <= pageCount; i++) {
                if (i == toPage) {
                    pageNumbers[i - 1].className = 'page-number active';
                } else {
                    pageNumbers[i - 1].className = 'page-number';
                }
            }
            //更新页面
            $.ajax({
                type: 'POST',
                url: '/api/contact.php',
                dataType: 'json',
                data: {
                    cmd: 'list',
                    num: 20,
                    page: toPage
                },
                success: function (data) {
                    switch (data.code) {
                        case 0:
                            console.log('Wrong page number!');
                            break;
                        case 1:
                            console.log('获取联系人成功');
                            //创建联系人DOM
                            createContact(data.info, toPage);
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
        } else {
            console.log('Wrong page number!')
        }
    }

    //获取当前页
    function getCurrentPage() {
        return +$('.pagination .active').text();
    }


    /***** 2.事件处理部分 *****/
    //参照 https://github.com/cssmagic/blog/issues/48

    //按钮事件列表
    var actionList = {
        //修改用户信息
        'change-user-info': function () {

        },
        //退出登录
        'log-out': function () {
            handleLogout();
        },
        //新建联系人
        'new-contact': function () {
            CMD = 'add';
            //改标题
            $('.contact-editor .page-title').html('新建联系人');
            $('.contact-editor .breadcrumb .active').html('正在新建');
            //切换内容板块
            $('.main-content').css('display', 'none');
            $('.contact-editor').css('display', 'block');
        },
        //新建分组
        'new-group': function () {
            CMD = 'add';
            //打开对话框
            $('#edit-group-dialog').modal('show')
            //改对话框标题
            $('#edit-group-dialog #edit-group-title').html('请输入分组名');
        },
        //导出联系人--excel
        'export-excel': function () {
        },
        //导出联系人--csv
        'export-csv': function () {
        },
        //导出联系人--txt
        'export-txt': function () {
        },
        //搜索联系人
        'search': function () {
            handleSearchContact();
        },
        //编辑联系人
        'edit-contact': function () {
            handleEditContact();
        },
        //删除联系人
        'delete-contact': function () {
            handleDeleteContact();
        },
        //点击分组
        'group': function () {

        },
        /**** a.新建/编辑联系人底部 ****/
        //保存按钮
        'edit-contact-submit': function () {
            //触发提交表单事件
            $('#edit-contact-form').submit();
        },
        //取消按钮
        'edit-contact-cancel': function () {
            //切换内容板块
            $('.main-content').css('display', 'block');
            $('.contact-editor').css('display', 'none');
        },
        /**** b.新建/编辑分组对话框 ****/
        //保存按钮
        'edit-group-submit': function () {
            //触发提交表单事件
            $('#edit-group-form').submit();
        },
        //取消按钮
        'edit-group-cancel': function () {

        },

        /**** 分页按钮 ****/
        'pre-page': function () {
            DATA_ID = getCurrentPage() - 1;
            handlePageSwitch(DATA_ID);
        },
        'next-page': function () {
            DATA_ID = getCurrentPage() + 1;
            handlePageSwitch(DATA_ID);
        },
        'page-number': function () {
            handlePageSwitch(DATA_ID);
        }
    }

    //绑定事件
    function bindEvent() {

        //事件委托,处理点击事件
        $('body').on('click', '[data-action]', function () {
            //如果是编辑联系人或点击分组或翻页，则传入ID
            var dataId = $(this).attr('data-id');
            DATA_ID = (dataId == undefined) ? DATA_ID : dataId;

            var actionName = $(this).data('action');
            var action = actionList[actionName];

            if ($.isFunction(action)) action();

            //阻止默认的点击事件
            return false;
        })

        //绑定搜索回车事件
        $('#search-text').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                handleSearchContact();
                //阻止默认的回车跳转事件
                return false;
            }
        });
    }


    /***** 3.表单验证 *****/
    //绑定验证
    function bindValidate() {
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
                    string: true
                }
            },
            messages: {
                newGroupName: {
                    required: '请填写分组名!',
                    minlength: '分组名最少为1个字符!',
                    maxlength: '分组名最多为8个字符!',
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
                        name: $('#edit-group-input').val(),
                        id: DATA_ID
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
                                window.location.reload();
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
                console.log('输入有误,无法向后台提交信息,提示用户重新填写')
                //阻止表单提交
                return false;
            }
        });

        //自定义对分组名的验证方法(只允许汉字、数字、字母和下划线的组合)
        $.validator.addMethod('string', function (value, element, params) {
            var string = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            return this.optional(element) || (string.test(value));
        }, '输入不合法(只允许汉字、数字、字母和下划线的组合)!');
    }


    /***** 4.其它 *****/

    render();
});

