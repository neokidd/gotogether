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

    return exports;
});