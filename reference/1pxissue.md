## 遇到的问题 ##

**设置元素的border宽度为1px时，在高清屏的手机呈现不是1px, 在devicePixelRatio为2的时候，呈现2px,  在devicePixelRatio为3的时候，呈现3px**

*此问题发生在已定义viewport meta后的webapp页面，不包含普通的未设置此meta的页面*

##各种viewport定义##

**两个概念,visual viewport跟layout viewport.**，在iphone的320px物理屏幕-**视觉窗口(visual viewport)**, 创建出了一个980px的虚拟窗口-**布局窗口(layout viewport)**。 


**viewport的由来**

visual viewport可以认为是设备自己的宽度，那么注意，当你打开一个960px设计的网页时，手机会根据css中的百分比进行缩放。比如总长960的页面，导航条是20%。（实际解析出来就是192px）但是你不可能每个属性都是百分比吧，比如文字大小。那么我用320px屏幕打开，导航条就成了64px了，但是我的字体大小是12px啊，完了，本来能显示很多汉字的（192/12）现在只能显示64/12个汉字了。

Apple找到了一个办法：在移动版(iOS)的Safari中定义了viewport meta标签①，它的作用就是创建一个虚拟的窗口(viewport)，而且这个虚拟窗口的分辨率接近于桌面显示器，Apple将其定位为980px②。不同的浏览器厂商对于layout viewport的大小定义不同
	
	 Safari iPhone: 980px
	 Opera: 850px
	 Android WebKit: 800px
	 IE: 974px


- 以一代iphone下的Safari来说就是：在iphone的320px物理屏幕上——视觉窗口(visual viewport)，创建出了一个980px的虚拟窗口——布局窗口(layout viewport)，在视觉窗口(visual viewport)中我们可以拖动横向竖向滑动条或者放大缩小网页，来达到最佳的浏览效果(类似桌面浏览器)；而布局窗口(layout viewport)用来配合CSS渲染布局，例如当我们设置一个容器的宽度为100%时，这个容器的实际值为980px而不是320px。如此一来大部分 网页就能以缩放的形式正常的显示在手机屏幕上了。

- 当我们"为了"解决手机端的问题，而特意制作了320px的页面时，悲剧发生了。因为iphone的layout viewport默认为980px，导致专为其优化的320px宽的页面只能以缩放的方式显示，（可以想象在你的浏览器里打开一个320px的页面的情景。。。）这时就需要对viewport进行设置
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
将viewport定义为：宽度为设备宽度，初始缩放比例为1倍，禁止用户缩放。这其实是故意舍弃了viewport的做法，大家一定要明白这个道理。

把过程整理如下:
	
	普通的页面(960,980)显示很差 --> Apple去开发viewport --> 我们要求设计师设计320px的网页 --> 变回来 content="width=device-width

以上可以得出:

1. **当页面未设置viewport meta时，用虚拟的980px的布局窗口呈现**
2. **当设置viewport meta时，会用视觉窗口呈现**


## 前端工程师关心的名词 ##

1. CSS Pixels - *浏览器使用的抽象单位， 主要用来在网页上绘制内容*
2. Device Pixels - *显示屏幕的的最小物理单位，每个dp包含自己的颜色、亮度*
3. devicePixelRatio - *设备上物理像素和设备独立像素(device-independent pixels (dips))的比例*
	
		公式表示就是：window.devicePixelRatio = 物理像素 / dips

   	**通俗的说2x屏是4个物理像素点呈现1个CSS抽象的像素点，3x屏是9个物理像素点呈现1个CSS抽象的像素点**这也是1px问题产生的原因

4. 设备独立像素 - 大家常常见到的 320px(iphone 3gs/4/4s/5/5s), 375px(iphone 6), 414px(iphone 6plus)。


## 解决方法 ##

其他行家已经总结了很多，这里不赘述了，具体请[参考](http://www.ghugo.com/css-retina-hairline/?utm_source=tuicool)


结合返利网的实际情况，推荐使用

1. 前台js判断增加hareline class
	
		!function () {
		    var ua = navigator.userAgent;
		    var appv = navigator.appVersion;
		    var isIos = /iP(hone|od|ad)/.test(ua);
		    var html = document.documentElement;
		    
		    !function () {
		        //1. ios, HTML.fl-ios
		        //2. ios version > 8, HTML.fl-hairlines
		        var vArr, ver;
		
		        if (isIos) {
		            html.classList.add("fl-ios");
		            vArr = appv.match(/OS (\d+)_(\d+)_?(\d+)?/);
		            ver = parseInt(vArr[1], 10);
		
		            if (ver >= 8) {
		                html.classList.add("fl-hairlines");
		            }
		        }
		    }();
		}();
	

2. 对ios7以下和其他android机：维持原样，不去处理，随着时间的推移，最终都会支持0.5 和 0.3 px边框的。

		.fl-hairline .ele{
			border-width: 0.5px;
		}
		


## 参考 ##

1. [此像素非彼像素](http://www.w3cplus.com/css/A-pixel-is-not-a-pixel-is-not-a-pixel.html)
2. [viewport](http://www.cnblogs.com/2050/p/3877280.html)
3. [设备像素比devicePixelRatio简单介绍](http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/)
4. [响应式网页设计](http://isux.tencent.com/responsive-web-design.html)
5. [再谈mobile web retina 下 1px 边框解决方案](http://www.ghugo.com/css-retina-hairline/?utm_source=tuicool)