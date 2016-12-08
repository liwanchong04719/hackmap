/**
 * Created by zhongxiaoming on 2015/10/26.
 * Class ajaxConstruct
 */
fastmap.mapApi.ajaxConstruct = function(url, func) {
    if (document.getElementById) {
        var x = (window.XDomainRequest) ? new XDomainRequest() : new XMLHttpRequest();
        if (window.XDomainRequest) {
            x.xdomain = 1
        }
    }
    if (x) {
        x.onreadystatechange = function() {
            var el = el || {};
            if (x.xdomain || x.readyState == 4) {
                var d = 0;
                var el;
                if (x.xdomain || x.status == 200) {
                    //if(url.match(/\/edit\?/)!=null && url.match(/\/edit\?/).length >0){
                    if (url.match("CREATE") != null || url.match("UPDATE") != null || url.match("DELETE") != null) {
                        var eventController = fastmap.uikit.EventController();
                        eventController.fire('editAjaxCompleted', {});
                    }
                    if (x.responseText && x.responseText[0] != "<" && x.responseText != "[0]") {
                        if (window.JSON) {
                            d = window.JSON.parse(x.responseText)
                        } else {
                            d = eval("(" + x.responseText + ")")
                        }
                        func(d);
                    }
                }
            }
        };
        if (x.xdomain) {
            x.onerror = function() {
                console.log('ajax error!');
            };
            x.ontimeout = function() {
                console.log('ajax timeout!');
            };
            x.onprogress = function() {
                console.log('ajax progress!');
            };
            x.onload = x.onreadystatechange
        }
        x.open("GET", url);
        x._url = url;
        x.send()
    }
    return x;
};