(function() {

	function startWeixinShareGuide() {
		if (!document.querySelector("#J_fanli_wein_guide")) {
			buildGuide();
		} else {
			showGuide();
		}
	}

	function showGuide() {
		document.querySelector("#J_fanli_wein_guide").style.display = "block";
	}

	function hideGuide() {
		document.querySelector("#J_fanli_wein_guide").style.display = "none";
	}

	function buildGuide() {
		var isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		var DIV = document.createElement("DIV");
		DIV.setAttribute("id", "J_fanli_wein_guide");
		DIV.style.cssText = "position:fixed; top:0;left:0; z-index:9999; display:block;width:100%; height:100%;background:rgba(0,0,0,.7);";

		var A = document.createElement("A");
		A.setAttribute("href", "javascript:void(0)");
		A.style.cssText = isIos ? "display:block;width:100%; height:100%; background:url(http://static2.51fanli.net/webapp/images/share/share-ios.alpha.png) no-repeat; background-size:100% auto;"
						: "display:block;width:100%; height:100%; background:url(http://static2.51fanli.net/webapp/images/share/share-android.alpha.png) no-repeat; background-size:100% auto;";

		DIV.appendChild(A);

		DIV.addEventListener("click", function () {
			hideGuide();
		}, false);

		document.getElementsByTagName("body")[0].appendChild(DIV);
	}
	
	

}());