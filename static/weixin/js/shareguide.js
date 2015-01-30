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
