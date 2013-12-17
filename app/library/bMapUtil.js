/**
 * Created by yunlong on 13-12-17.
 */

Library.bMapUtil = sumeru.Library.create(function(exports){
    exports.initMap = function(map,mapElement){
        if(!map) {
            map = new BMap.Map(mapElement);            // 创建Map实例
            var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
            map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
            map.enableScrollWheelZoom();                            //启用滚轮放大缩小
            map.addControl(new BMap.NavigationControl());
        }

        return map;
    };

    exports.keywordLocation = function(map,inputText,resultPanel){
        function G(id) {
            return document.getElementById(id);
        }

        var map = new BMap.Map("l-map");
        map.centerAndZoom("北京",12);                   // 初始化地图,设置城市和地图级别。

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : "suggestId"
                ,"location" : map
            });

        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            setPlace();
        });

        function setPlace(){
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
    }

    return exports;
});