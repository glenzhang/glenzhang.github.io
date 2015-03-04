
#技巧#

1. 用`-webkit-tap-highlight-color`代替`a:active`
2. 酌情使用touchend代替click, 移动浏览器上click会延时300ms

3. 用CSS动画代替JS动画，在Android平台上可以平稳退化，放弃动画效果(包括CSS3动画)

4. css3动画闪烁解决方案 强制把需要进行动画行为的dom对象在GPU中创建Layout缓存 
		
		-webkit-transform:translateZ(0);
		-webkit-transform-style:preserve-3d;
		-webkit-backface-visibility:hidden;

5. 将css3动画属性style到元素，以加快解析执行


6. 跨域, 增加允许http跨域头
	
		php: header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");

7. 用手机自带浏览器访问某页面如： http://m.51fanli.com, 然后再用app webview打开这个页面，其session是向通的。


8. 用HTML5的离线存储和本地存储进行缓存，或者将页面直接打包到客户端中，减少在网络下载中的耗时。

9. 减少DOM数量，尽可能少的使用`position:relative`，减少对DOM的操作

10. 避免GIF图片的使用(消耗内存)

11. 如果只是在移动端使用的话，请使用iScroll-lite来代替iScroll(iScroll里面增加了很多额外的功能，比如在PC上模拟滚动)，在允许的情况下，可以关闭滚动条(滚动条也是创建的DOM元素)

12. 典型的web app head部分
		
		<!doctype html>
		<html>
			<head>
    			<title>site title</title>
    			<meta charset="utf-8">
    			<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    			<meta name="apple-mobile-web-app-capable" content="yes"/>
    			<meta name="apple-mobile-web-app-capable" content="yes"/>
    			<meta name="format-detection" content="telephone=no">
    			<meta name="format-detection" content="address=no">
    			<meta name="format-detection" content="email=no">
    			<meta http-equiv="x-dns-prefetch-control" content="on" />
    			<link rel="dns-prefetch" href="//l0.51fanli.net">
    			<link rel="dns-prefetch" href="//l1.51fanli.net">
    			<link rel="dns-prefetch" href="//l2.51fanli.net">
    			<link rel="dns-prefetch" href="//l3.51fanli.net">
    			<link rel="dns-prefetch" href="//l4.51fanli.net">
    			<link rel="dns-prefetch" href="//static2.51fanli.net">
    			<link rel="apple-touch-icon-precomposed" size="114x114" href="http://static2.51fanli.net/common/images/webapp/dockicon.png"/>
		  </head>


#坑点#

###CSS
1. 红米手机-圆角外背景色溢出

    *对元素设置圆角及背景色 border-radius:50px;background-color:#000; 四个圆角外会溢出背景色*
	
	**解决方案：**增加样式`background-clip:padding-box;`

	>[参考](http://blog.csdn.net/luochao_tj/article/details/21469017)

2. 小米1s手机-android2.3以下`fixed+transform`无效
	
    *对fixed元素使用transform,沿着y轴-100%隐藏，等待触发时机*
	
	**解决方案：**先将元素隐藏，在触发之前动画之前显示，有动画效果的可以见到，无动画效果的直接显示。

3. 魅族手机-gmu1.0, 2.0 dialog widget导致样式破坏
	
    *dialog widget容器外宽度无效*
	
	**解决方案：**css改变容器`min-width`

### JS

1. 软键盘调出后隐藏，一些fixed元素布局呈现到奇怪的位置
	
	*调出软键盘后，点击取消，页面隐藏的fixed元素浮出*

	**解决方案：**调用scrollTo重绘页面

		setTimeout(function() {
     		window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
		}, 0);

  
###DOM

...

###其它

1. iScroll横向滚动区域无法拉动页面

	*在设定wrapper为横向滚动时，如果你手指放在该区域，将无法拉动页面*

	**解决方案：**[参考](http://www.chengxuyuans.com/javascript/66459.html)

		myScroll = new iScroll('scrollpanel', {
   			// other options go here...
    		hScroll: true,
    		onBeforeScrollStart: function ( e ) {
       			if ( this.absDistX > (this.absDistY + 5 ) ) {
            	// user is scrolling the x axis, so prevent the browsers' native scrolling
            	e.preventDefault();
        		}
    		},
    		//解决第一次无法滑动的问题
    		onTouchEnd: function () {
        		var self = this;
        		if (self.touchEndTimeId) {
                	clearTimeout(self.touchEndTimeId);
        		}
 
        		self.touchEndTimeId = setTimeout(function () {
                	self.absDistX = 0;
                	self.absDistY = 0;
        		}, 600);
    		}
		});

2. font-face字体下载需要跨域
   
    *当静态资源服务器和当前访问站点不在同域时，用chrome手机模拟器无法下载字体*
   
    **解决方案：** 在静态资源服务器设置跨域头，以apache为例，[参考](http://stackoverflow.com/questions/8245464/cross-domain-font-face-issues)。在Apache httpd.conf增加

		<FilesMatch "\.(ttf|otf|eot|woff)$">
    		<IfModule mod_headers.c>
         		Header set Access-Control-Allow-Origin "http://m.51fanli.com"
    		</IfModule>
		</FilesMatch>
