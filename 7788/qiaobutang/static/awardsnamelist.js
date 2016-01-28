(function () {
    String.prototype.format = function () {
        for (var temS = this, i = 0; i < arguments.length; ++i) {
            temS = temS.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        } return temS;
    };

    function StringBuilder() {
        this.strings = new Array();
    }
    StringBuilder.prototype.append = function (str) {
        this.strings.push(str); return this;
    };
    StringBuilder.prototype.toString = function () {
        return this.strings.join("");
    };

    var lsKey = "ep";
    var $ul = $("#J_namelist ul");
    var $prizeArea = $("#J_prize_area");
    var $ydj = $("#J_ydj");
    var $num = $("#J_num");
    var currentNum = parseInt($num.val());
    var $trigger = $("#first");
    var $disabledTrigger = $("#fir");

    var intervalId;
    var settimeId;

    if (!localStorage.getItem(lsKey)) {
        localStorage.setItem(lsKey, JSON.stringify({ ea: employeeArr }));
    }

    var employeeArrVariant = JSON.parse(localStorage.getItem(lsKey)).ea;

    $ydj.find("option").each(function () {
        var val = $(this).val();
        $prizeArea.append(localStorage.getItem("ydj{0}".format(val)));
    });

    function applyBehavior() {
        var firstUl = $("#J_namelist").find("ul:first");
        var firstLi = firstUl.find("li:first");
        verticalScroll(firstUl, firstLi)
    }

    function verticalScroll(fu, fi) {
        var height = -(fi.outerHeight(true)) + "px";
        fu.animate({ marginTop: height }, 50, function () {
            var $this = $(this);
            $this.css({ marginTop: "0px" }).find("li:first").remove();

            if ($("li", $this).length <= 3) {
                $ul.append(buildHtml());
            }
        });
    }

    function start() {
        intervalId = setInterval(function () {
            applyBehavior();
        }, 55);
    }

    function stop() {
        clearInterval(intervalId);
        setTimeout(function () {
            buildSelectedList();
        }, 250);
    }

    function buildSelectedList() {
        var $li = $("li:eq(0)", $ul);
        var name = $li.find(".J_name").text();
        var dept = $li.find(".J_dept").text();

        var $trycyd = $("div[data-ydj={0}]".format($ydj.val()));
        var $cydj;

        if ($trycyd.length == 0) {
            $cydj = $("<div data-ydj='{0}'><span>{1}</span>: </div>".format($ydj.val(), $ydj.find(":selected").text())).appendTo($prizeArea);
        } else {
            $cydj = $trycyd;
        }

        $(employeeArrVariant).each(function (i) {
            var t = this;
            if (t.name == name && t.dept == dept) {
                employeeArrVariant.splice(i, 1);
                localStorage.setItem(lsKey, JSON.stringify({ ea: employeeArrVariant }));

                return false;
            }
        });

        $cydj.append(name + "(" + dept + ") ");

        localStorage.setItem("ydj{0}".format($ydj.val()), $cydj.prop("outerHTML"));

        currentNum--;
        if (currentNum > 0) {
            start();
            setTimeout(function () { stop(); }, 2 * 1000);
        } else {
            $trigger.show();
        }
    }

    function buildHtml() {
        var sb = new StringBuilder();
        var arr = randomArrayItems.call(employeeArrVariant, 5);
        for (var i = 0; i <= arr.length - 1; ++i) {
            sb.append("<li>")
                .append("<p class='name'><span class='J_name'>{0}</span></p>".format(employeeArrVariant[arr[i]]["name"]))
                .append("<p class='dept'><span class='J_dept'>{0}</span></p>".format(employeeArrVariant[arr[i]]["dept"]))
              .append("</li>")
        }
        return sb.toString();
    }

    function randomArrayItems(count) {
        var that = this;
        var originalArrayLength = that.length;
        var hasChecked = [];

        if (!count) {
            count = 2;
        }

        if (count > originalArrayLength) {
            count = originalArrayLength;
        }

        (function (total) {
            var t1;
            do {
                t1 = Math.floor(Math.random() * originalArrayLength);
            }
            while (checkInArray(t1, hasChecked))

            hasChecked.push(t1);

            total--;

            if (total >= 1) {
                arguments.callee(total);
            }

        })(count);

        return hasChecked;
    }


    function checkInArray(el, arr) {
        var arrLen = arr.length;
        var returnResult = false;

        if (!arrLen) {
            return false;
        }

        for (var i = 0; i <= arrLen - 1; ++i) {
            if (el === arr[i]) {
                returnResult = true;
                break;
            }
        }
        return returnResult;
    }

    $trigger.on("click", function () {
        if (employeeArrVariant.length == 0) {
            alert("哇！！全体员工都中奖了哦--！");
            $(this).hide();
            return;
        }

        currentNum = parseInt($num.val());

        $(this).hide();
        $disabledTrigger.show();
        $ul.append(buildHtml());
        start();

        if (settimeId) {
            clearTimeout(settimeId);
        }

        $("#footer").hide();
    });

    $disabledTrigger.on("click", function () {
        //$(this).parent().hide();
        $(this).hide();
        if (currentNum <= 0) {
            $trigger.show();
        }
        stop();
        $("#footer").show();
        $("#context").show();

        settimeId = setTimeout(function () { $("#footer").hide() }, 60000);
    });

}());