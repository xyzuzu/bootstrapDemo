/**
 * Created by Administrator on 2016/9/29.
 */
$(function(){
    //$('.carousel').carousel({
    //    interval: 2000
    //});

    banner();
});

/*轮播图动态加载效果*/
function banner(){
    /*
    1.请求数据--ajax
    2.判断当前是移动端页面还是非移动端--判断宽度 $(window).width()
    3.调用模板引擎生成可渲染的html代码:artTemplate-native.js   underscore.js
    4.渲染
    * */

    /*1.发送ajax请求*/
    var mydata=null;
    var getData=function(callback){
        if(mydata !=null){
            callback(mydata);
            return false;
        }
        $.ajax({
            type:"get",
            url:"../js/imgData.json",
            data:{},
            success:function(data){
                mydata=data;
                callback(data);
            }
        });
    }

    /*判断是否是移动端，进行html代码的渲染*/
    function  imgRender(){
        /*1.获取当前屏幕的宽度*/
        var width=$(window).width();
        /*2.创建一个标识，标记是否是移动端*/
        var isMobile=false; //默认不是移动端
        /*3.判断是否是移动端*/
        if(width<768){
            isMobile=true;
        }
        else if(width >=768){
            isMobile=false;
        }
        /*4.调用模板引擎，生成可渲染的html代码*/
        /*4.1获取数据*/
        var data=getData(function(data){
            /*4.2 调用artTemplate模板引擎，生成可渲染的html代码*/
            var html=template("imgTemp",{"items":data,"isMobile":isMobile});
            /*4.3渲染*/
            $(".carousel-inner").html(html);

            /*使用underscore.js生成标识html*/
            /*1.先读取模板的html内容，生成一个模板对象*/
            /*参数是模板的html字符串文本*/
            var indicator=_.template($("#indicatorTemp").html());
            /*调用模板对象的方法，传递数据，返回可渲染的html代码*/
            var indHtml=indicator({"items":data});
            /*渲染*/
            $(".carousel-indicators").html(indHtml);
        });
        //template("",data);
    }
    /*调用方法，进行第一次的数据请求*/
    imgRender();

    /*当屏幕大小发生变化的时候，应该重新请求数据进行渲染*/
    $(window).on("resize",function(){
        imgRender();
    });

    /*添加移动端的滑动事件*/
    var startX=0;
    var moveX=0;
    var distanceX=0;
    /*添加事件*/
    $(".carousel-inner").on("touchstart",function(e){
        startX= e.originalEvent.touches[0].clientX;

    });
    $(".carousel-inner").on("touchmove",function(e){
        moveX= e.originalEvent.touches[0].clientX;
        distanceX=moveX-startX;
    });
    $(".carousel-inner").on("touchend",function(e){
        /*调用轮播图组件自带的方法实现滑动效果*/
        if(Math.abs(distanceX)>50){
            if(distanceX>0){
                $(".carousel").carousel('prev');
            }
            else if(distanceX<0){
                $(".carousel").carousel('next');
            }
        }
    });
}