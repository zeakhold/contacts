$(document).ready(function () {
    //首先判断是否有cookie,有的话自动登录


    //登录表单验证
    $('#login-form').validate({
        rules: {
            phone: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11,
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 12
            }
        },
        messages: {
            phone: {
                required: '请填写手机号!',
                digits: '请输入合法的手机号!',
                minlength: '手机号长度应该是十一位',
                maxlength: '手机号长度应该是十一位',
            },
            password: {
                required: '请填写密码!',
                minlength: '密码最少为6位',
                maxlength: '密码最多为12位'
            }
        },
        //登录表单验证通过
        submitHandler: function (form) {
            console.log('校验正确,已向后台提交信息,等待后台回复');
            $.ajax({
                type: 'POST',
                url: 'https://keshe.b612.in/api/login.php',
                dataType: 'json',
                data: {
                    phone: $('#phone').val(),
                    pwd: $('#password').val(),
                    cmd: 'login'
                },
                success: function (data) {
                    switch (data.code) {
                        case 0:
                            alert('您已登录!');
                            break;
                        case 1:
                            console.log('登录成功');
                            break;
                        case 2:
                            console.log('登录失败:' + data.msg);
                            break;
                        default:
                            console.log('遇到未知错误');
                            break;
                    }
                },
                error: function () {
                    console.log('请求出错')
                }
            });
            //阻止表单提交
            return false;
        },
        //登录表单验证不通过
        invalidHandler: function (event, validator) {
            console.log('输入有误,无法向后台提交信息,提示用户重新填写')
            //阻止表单提交
            return false;
        }
    });

    //注册表单验证
    $('#register-form').validate({
        rules: {
            usernamesignup: {
                required: true,
                minlength: 2,
                maxlength: 12,
                string: true
            },
            phonesignup: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            passwordsignup: {
                required: true,
                minlength: 6,
                maxlength: 12,
                string: true
            },
            passwordsignup_confirm: {
                required: true,
                minlength: 6,
                maxlength: 12,
                equalTo: "#passwordsignup"
            }
        },
        messages: {
            usernamesignup: {
                required: '请填写用户名!',
                minlength: '用户名最少为2个字符',
                maxlength: '用户名最多为12个字符',
            },
            phonesignup: {
                required: '请填写手机号!',
                digits: '请输入合法的手机号!',
                minlength: '手机号长度应该是11位',
                maxlength: '手机号长度应该是11位'
            },
            passwordsignup: {
                required: '请填写密码!',
                minlength: '密码最少为6位',
                maxlength: '密码最多为12位'
            },
            passwordsignup_confirm: {
                required: '请确认密码!',
                equalTo: "密码不一致!",
                minlength: '密码最少为6位',
                maxlength: '密码最多为12位'
            }
        },
        //注册表单验证通过
        submitHandler: function (form) {
            console.log('校验正确,已向后台提交信息,等待后台回复');
            $.ajax({
                type: 'POST',
                url: 'https://keshe.b612.in/api/login.php',
                dataType: 'json',
                data: {
                    username: $('#usernamesignup').val(),
                    phone: $('#phonesignup').val(),
                    pwd: $('#passwordsignup').val(),
                    email:'test@test.com',
                    cmd: 'signup'
                },
                success: function (data) {
                    switch (data.code) {
                        case -3:
                            alert('存在相同用户名');
                            break;
                        case -2:
                            console.log('存在相同手机号');
                            break;
                        case -1:
                            console.log('存在相同email');
                            break;
                        case 0:
                            console.log('写入数据库失败');
                            break;
                        case 1:
                            console.log('成功');
                            break;
                        default:
                            console.log('遇到未知错误');
                            break;
                    }
                },
                error: function () {
                    console.log('请求出错')
                }
            });
            //阻止表单提交
            return false;
        },
        //注册表单验证不通过
        invalidHandler: function (event, validator) {
            console.log('输入有误,无法向后台提交信息,提示用户重新填写')
            //阻止表单提交
            return false;
        }
    });

    //自定义对用户名和密码的验证方法(只允许汉字、数字、字母和下划线的组合)
    $.validator.addMethod('string', function (value, element, params) {
        var string = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        return this.optional(element) || (string.test(value));
    }, '输入不合法(只允许汉字、数字、字母和下划线的组合)!');
})