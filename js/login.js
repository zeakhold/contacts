$(document).ready(function() {
    //登录验证
    $('#login-form').validate({
        rules:{
            phone: {
                required: true,
                digits:true,
                minlength: 11,
                maxlength: 11
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 12
            }
        },
        messages:{
            phone: {
                required: '请填写手机号!',
                digits:'请输入合法的手机号!',
                minlength: '手机号长度应该是十一位',
                maxlength: '手机号长度应该是十一位'
            },
            password: {
                required: '请填写密码!',
                minlength: '密码最少为6位',
                maxlength: '密码最多为12位'
            }
        }
    });

    //注册验证
    $('#register-form').validate({
        rules:{
            usernamesignup: {
                required: true,
                minlength: 2,
                maxlength: 12
            },
            phonesignup: {
                required: true,
                digits:true,
                minlength: 11,
                maxlength: 11
            },
            passwordsignup: {
                required: true,
                minlength: 6,
                maxlength: 12
            },
            passwordsignup_confirm: {
                required: true,
                minlength: 6,
                maxlength: 12,
                equalTo: "#passwordsignup"
            }
        },
        messages:{
            usernamesignup: {
                required: '请填写用户名!',
                minlength: '用户名最少为2个字符',
                maxlength: '用户名最多为12个字符'
            },
            phonesignup: {
                required: '请填写手机号!',
                digits:'请输入合法的手机号!',
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
        }
    });
})