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
    var allCon = 0;
    for (var i = 0; i < len; i++) {
        var liHtml = $("<li><a href='#'" + " fid='" + data[i].fid + "'" + ">" + data[i].fname + "<span class='contact-num'>(" + data[i].count + ")</span></a></li>");
        liHtml.appendTo('.dashboard-menu');
        allCon += data[i].count;
    }
    $('.nav-header span').text("(" + allCon + ")");
}

function createGroupLab(data) {
    var len = data.length;
    for (var i = 0; i < len; i++) {
        var opHtml = $("<option value='"+i+"'" + " fid='" + data[i].fid +"'>"+data[i].fname+"</option>");
        opHtml.appendTo('.new-contact-group-option');
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
                    //创建左边栏分组DOM
                    createGroup(data.info);
                    //创建分组下拉标签DOM
                    createGroupLab(data.info);
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

}

$(document).ready(function () {
    init();

    //新建联系人表单验证
    $('#new-contact-form').validate({
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
        //新建联系人表单验证通过
        submitHandler: function (form) {
            console.log('校验正确,已向后台提交信息,等待后台回复');
            $.ajax({
                type: 'POST',
                url: '/api/contact.php',
                dataType: 'json',
                data: {
                    name: $('#new-contact-name').val(),
                    phone: $('#new-contact-phone').val(),
                    qq: $('#new-contact-qq').val(),
                    fenzu: $('.new-contact-group-option option:selected').attr('fid'),
                    email: $('#new-contact-email').val(),
                    addr: $('#new-contact-address').val(),
                    comp: $('#new-contact-company').val(),
                    cmd: 'add'
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
                            alert('成功新建联系人');
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

    //当点下'保存'按钮才提交表单
    $('#new-contact-submit').click(function () {
        //应该先验证后提交
        $('#new-contact-form').submit();
    })

    //放弃新建联系人
    $('#myModal .btn-danger').click(function() {
        window.location.pathname = '/contact.html';
    })
});

