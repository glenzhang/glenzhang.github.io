# Weixin js sdk #

有时候, h5页面需要在微信里面打开，而且微信的占有率是杠杠的。在分享朋友与朋友圈的时候，需要自定义title, img, url等。早期微信官方是不支持自定义的，有同行通过对微信APP的研究开发了[wechat.js](http://github.com/sofish/wechat.js), 帮助大家自定义分享内容。现在微信官方支持自定义了，本文介绍如何部署[jweixin](http://res.wx.qq.com/open/js/jweixin-1.0.0.js)。

 
## 准备一个已经认证的微信公众号 ##

1. 查看公众号是否认证。 [登录微信公众平台](https://mp.weixin.qq.com) - 设置 - 公众号设置 - 认证情况。 
2. **公众号主体类型为个人的无法申请认证**。
	> ![noauthright](http://www.qianduanbiji.com/static/weixin/images/noauthright.jpg)
3. 一定是微信认证，微博认证是无法调用分享接口的。
	> [附录5](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)-常见错误及解决方法- 8.在iOS和Android都无法分享（请确认公众号已经认证，只有认证的公众号才具有分享相关接口权限，如果确实已经认证，则要检查监听接口是否在wx.ready回调函数中触发）
 
## 获取appid和appsecret

1. [登录微信公众平台](https://mp.weixin.qq.com) - 开发者中心
2. appsecret是隐藏的，如`01****************************18`，请点击完整显示用微信扫一扫向管理员申请


## 接口调用上限

1. 	获取access_token	 每日调用上限2000次。 
	> [附录5](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)-常见错误及解决方法- 10.服务上线之后无法获取jsapi_ticket，自己测试时没问题。（因为access_token和jsapi_ticket必须要在自己的服务器缓存，否则上线后会触发频率限制。请确保一定对token和ticket做缓存以减少2次服务器请求，不仅可以避免触发频率限制，还加快你们自己的服务速度。目前为了方便测试提供了1w的获取量，超过阀值后，服务将不再可用，请确保在服务上线前一定全局缓存access_token和jsapi_ticket，两者有效期均为7200秒，否则一旦上线触发频率限制，服务将不再可用）。

2. 用redis被动缓存1个小时。

## 准备微信相关js ##

1. 判断微信浏览器
	
		var isFromWeixin = navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1;

2. 指导用户分享层

		(function () {
		    var guideId = "J_weixin_share_guide";
		    var $guide;
		
		    function openShareGuide() {
		        $guide = document.querySelector("#" + guideId);
		        if (!$guide) {
		            buildGuide();
		        } else {
		            showGuide();
		        }
		    }
		
		    function showGuide() {
		        $guide.style.display = "block";
		    }
		
		    function hideGuide() {
		        $guide.style.display = "none";
		    }
		
		    function buildGuide() {
		        var isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		        var DIV = document.createElement("DIV");
		        DIV.setAttribute("id", guideId);
		        DIV.style.cssText = "position:fixed; top:0;left:0; z-index:9999; display:block;width:100%; height:100%;background:rgba(0,0,0,.7);";
		
		        var A = document.createElement("A");
		        A.setAttribute("href", "javascript:void(0)");
		        A.style.cssText = isIos ? "display:block;width:100%; height:100%; background:url(http://www.qianduanbiji.com/static/weixin/images/share-ios.alpha.png) no-repeat; background-size:100% auto;" : "display:block;width:100%; height:100%; background:url(http://www.qianduanbiji.com/static/weixin/images/share-android.alpha.png) no-repeat; background-size:100% auto;";
		
		        DIV.appendChild(A);
		
		        DIV.addEventListener("click", function () {
		            hideGuide();
		        }, false);
		
		        document.getElementsByTagName("body")[0].appendChild(DIV);
		    }
		
		    return YourOwnNamespace = {
		        openShareGuide: openShareGuide
		    };
		
		}());

3. js加载器， 如[head.js](http://headjs.com)
4. [weixin js sdk文件](http://res.wx.qq.com/open/js/jweixin-1.0.0.js)


## 部署 ##

**h5页面如果是在自己的App打开就调用自己的分享逻辑了。weixin js sdk应是无侵入式的，不破坏原有逻辑， 在微信浏览器打开需要分享的页面时才会加载上面准备的js文件**

1. 生成签名，请[参照](http://demo.open.weixin.qq.com/jssdk/sample.zip)

2. 新建公用可引入模板(有一些变量依赖后台代码输出)， 如 wx.html，内容如下

		<script>
		if (isFromWeixin) {
		    window.wxFanliConfig = {
		        debug: false,
		        // 朋友圈
		        timeline: {
		            title: <?php echo!empty($wxShareTimeline['title']) ? '"'.$wxShareTimeline['title'].
		            '"': "document.title"; ?> ,
		            desc: <?php echo!empty($wxShareTimeline['desc']) ? '"'.$wxShareTimeline['desc'].
		            '"': "document.title"; ?> ,
		            url: <?php echo!empty($wxShareTimeline['url']) ? '"'.$wxShareTimeline['url'].
		            '"': "location.href"; ?> ,
		            img: <?php echo!empty($wxShareTimeline['img']) ? '"'.$wxShareTimeline['img'].
		            '"': "document.images[0].src"; ?>
		        },
		        // 朋友
		        session: {
		            title: <?php echo!empty($wxShareSession['title']) ? '"'.$wxShareSession['title'].
		            '"': "document.title"; ?> ,
		            desc: <?php echo!empty($wxShareSession['desc']) ? '"'.$wxShareSession['desc'].
		            '"': "document.title"; ?> ,
		            url: <?php echo!empty($wxShareSession['url']) ? '"'.$wxShareSession['url'].
		            '"': "location.href"; ?> ,
		            img: <?php echo!empty($wxShareSession['img']) ? '"'.$wxShareSession['img'].
		            '"': "document.images[0].src"; ?>
		        },
		
		        appId: <?php echo!empty($wxShare['appId']) ? '"'.$wxShare['appId'].
		        '"': "\"\""; ?> ,
		        timestamp: <?php echo!empty($wxShare['timestamp']) ? '"'.$wxShare['timestamp'].
		        '"': "\"\""; ?> ,
		        nonceStr: <?php echo!empty($wxShare['nonceStr']) ? '"'.$wxShare['nonceStr'].
		        '"': "\"\""; ?> ,
		        signature: <?php echo!empty($wxShare['signature']) ? '"'.$wxShare['signature'].
		        '"': "\"\""; ?> ,
		        jsApiList: [
		            'onMenuShareTimeline',
		            'onMenuShareAppMessage'
		        ]
		    };
		
		    pageJsListArr.push("http://res.wx.qq.com/open/js/jweixin-1.0.0.js");
		    pageJsListArr.push("http://www.qianduanbiji.com/static/weixin/js/shareguide.js");
		
		    pageJsLoadedCallbackArr.push(function() {
		        // weixin config
		        wx.config({
		            debug: wxFanliConfig.debug,
		            appId: wxFanliConfig.appId,
		            timestamp: wxFanliConfig.timestamp,
		            nonceStr: wxFanliConfig.nonceStr,
		            signature: wxFanliConfig.signature,
		            jsApiList: wxFanliConfig.jsApiList
		        });
		
		        wx.ready(function() {
		
		            // config信息验证后会执行ready方法，
		            // 所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
		            // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
		            // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		
		            // 分享给朋友
		            wx.onMenuShareAppMessage({
		                title: wxFanliConfig.session.title,
		                desc: wxFanliConfig.session.desc,
		                link: wxFanliConfig.session.url,
		                imgUrl: wxFanliConfig.session.img,
		                trigger: function(res) {
		                    //alert('用户点击发送给朋友');
		                },
		                success: function(res) {
		                    //alert('已分享');
		                },
		                cancel: function(res) {
		                    alert('已取消');
		                },
		                fail: function(res) {
		                    alert('分享失败');
		                }
		            });
		
		            // 分享到朋友圈
		            wx.onMenuShareTimeline({
		                title: wxFanliConfig.timeline.title,
		                desc: wxFanliConfig.timeline.desc,
		                link: wxFanliConfig.timeline.url,
		                imgUrl: wxFanliConfig.timeline.img,
		                trigger: function(res) {
		                    //alert('用户点击分享到朋友圈');
		                },
		                success: function(res) {
		                    //alert('已分享');
		                },
		                cancel: function(res) {
		                    alert('已取消');
		                },
		                fail: function(res) {
		                    //alert(JSON.stringify(res));
		                    alert('分享失败');
		                }
		            });
		
		        });
		
		        wx.error(function(res) {
		            // config信息验证失败会执行error函数，如签名过期导致验证失败，
		            // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		        });
		    });
		}
		</script>

	**php变量需要后台输出**

3. 在需要定制分享的页面引入wx.html

4. 载入
	
		setTimeout(function(){head.load(pageJsListArr, function() {
	        for(var i = 0, len = pageJsLoadedCallbackArr.length; i < len; ++i) {
	            pageJsLoadedCallbackArr[i]();
	        }
    	});}, 10);


## 坑点 ##

1. 认证公众号才有分享权限
2. 页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行
3. 获取access_token	 每日调用上限2000次

## 参考 ##
1. [api demo](http://demo.open.weixin.qq.com/jssdk)
2. [微信JSSDK说明文档](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)
3. [接口频率限制说明](http://mp.weixin.qq.com/wiki/0/2e2239fa5f49388d5b5136ecc8e0e440.html)
4. [常见错误及解决方法](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.955-.E5.B8.B8.E8.A7.81.E9.94.99.E8.AF.AF.E5.8F.8A.E8.A7.A3.E5.86.B3.E6.96.B9.E6.B3.95)


**还未涉及到微信支付，留待后续补充**