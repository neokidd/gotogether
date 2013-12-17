/**
 * Created by yunlong on 13-12-17.
 */

Library.bMapUtil = sumeru.Library.create(function(exports){
    exports.initMap = function(mapElement){
        var map = new BMap.Map(mapElement);            // 创建Map实例
        var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
        map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
        map.enableScrollWheelZoom();                            //启用滚轮放大缩小
        map.addControl(new BMap.NavigationControl());

        return map;
    };

    exports.keywordLocation = function(map,suggestText,callback){
        var ac = new BMap.Autocomplete( {
                "input" : suggestText,
                "location" : map
            });

        var myValue;

        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

            setPlace();
        });

        function setPlace(){
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
                callback(pp,myValue);
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
    };

    exports.getLocation = function(succCallback,errorCallback,loadingFunc){
        var geolocation = new BMap.Geolocation();

        var defaultPositionOptions = {
            enableHighAccuracy:true,
            maximumAge:15000
        }

        var defaultCallback = function(error){
            console.log('H5 failed ',error);
        };

        errorCallback || (errorCallback = defaultCallback);

        geolocation.getCurrentPosition(locCallback);
        loadingFunc && loadingFunc();

        var locCallback = function(pos){
            var status = geolocation.getStatus();
            BMAP_STATUS_SUCCESS == status ? succCallback(pos):errorCallback(status);
        }

    };

    exports.pointToAddress = function(pt,callback){
        var gc = new BMap.Geocoder();
        gc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            var address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            callback(addCompOriObj,addressStr);
        });
    }

    return exports;
});