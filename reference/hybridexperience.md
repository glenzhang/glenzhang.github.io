#CSS
1. 红米手机-圆角外背景色溢出

	> 对元素设置圆角及背景色 border-radius:50px;background-color:#000; 四个圆角外会溢出背景色
	
	**解决方案：**增加样式`background-clip:padding-box;`[参考](http://blog.csdn.net/luochao_tj/article/details/21469017)

2. 小米1s手机-android2.3以下`fixed+transform`无效
	> 对fixed元素使用transform,沿着y轴-100%隐藏，等待触发时机。
	
	**解决方案：**先将元素隐藏，在触发之前动画之前显示，有动画效果的可以见到，无动画效果的直接显示。

3. 魅族手机-gmu1.0, 2.0 dialog widget导致样式破坏
	> 场景:dialog widget容器外宽度无效。
	
	**解决方案：**css改变容器`min-width`

#JS

1. 软键盘调出后隐藏，一些fixed元素布局呈现到奇怪的位置
	
	> 调出软键盘后，点击取消，页面隐藏的fixed元素浮出

	**解决方案：**调用scrollTo重绘页面

		setTimeout(function() {
     		window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
		}, 0);

  
#DOM

...

#其它

1. iScroll横向滚动区域无法拉动页面

	>在设定wrapper为横向滚动时，如果你手指放在该区域，将无法拉动页面

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

