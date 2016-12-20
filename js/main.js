//保证不同分辨率下footer能固定在底部
$(function(){
    //设置主内容窗口最小高度min-height
    var h=window.innerHeight||document.body.clientHeight||document.documentElement.clientHeight;
    h = h - $(".navbar").height() - $("footer").height();
    $(".content").css("min-height",h);

    //判断主内容高度与窗口高度的大小
    function footerPosition(){
        $("footer").removeClass("fixed-bottom");
        var contentHeight = document.body.scrollHeight,//网页正文全文高度
            winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
        if(!(contentHeight > winHeight)){
            //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
            $("footer").addClass("fixed-bottom");
        } else {
            $("footer").removeClass("fixed-bottom");
        }
    }
    footerPosition();
    $(window).resize(footerPosition);
});