/**
 * Created by yunlong on 13-12-5.
 */
sumeru.router.add(
    {
        pattern: 'locationtest',
        action: 'App.locationtest'
    }
);


App.locationtest = sumeru.controller.create(function(env, session){

    env.onrender = function(doRender){
        doRender("locationtest", ['push','right']);
    };

    var bm;
    var markergps;
    var labelgps = new BMap.Label("name",{offset:new BMap.Size(20,-10)});
    var prePoint;

    var locArr = []

    env.onready = function(viewRoot){


        if(!bm) {
            bm = new BMap.Map("map");            // 创建Map实例
            var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
            bm.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
            bm.enableScrollWheelZoom();                            //启用滚轮放大缩小
            bm.addControl(new BMap.NavigationControl());
        }
    };


    window.setInterval(successCallback,3000);
//    successCallback();

    function successCallback(position) {

//        locArr.push(Library.generateLocation.generateGPS());
        var currentLoc = Library.generateLocation.generateGPS();

        // 百度地图API功能
        //GPS坐标

        var gpsPoint = new BMap.Point(currentLoc.x,currentLoc.y);

        if(prePoint) {
            var polyline = new BMap.Polyline([
                prePoint,
                gpsPoint
            ], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0});
            bm.addOverlay(polyline);
        }

        if(!markergps) {
            markergps = new BMap.Marker(gpsPoint);
            bm.addOverlay(markergps); //添加GPS标注
        }  else {
            bm.removeOverlay(markergps);
            markergps.setPosition(gpsPoint);
            bm.addOverlay(markergps);
        }
        markergps.setLabel(labelgps); //添加GPS标注


        prePoint = gpsPoint;
//

        //坐标转换完之后的回调函数
        translateCallback = function (point){
            var marker = new BMap.Marker(point);
            bm.addOverlay(marker);
            var label = new BMap.Label("我是百度标注哦",{offset:new BMap.Size(20,-10)});
            marker.setLabel(label); //添加百度label
            bm.setCenter(point);
            alert(point.lng + "," + point.lat);
        }

//        setTimeout(function(){
//            BMap.Convertor.translate(gpsPoint,0,translateCallback);     //真实经纬度转成百度坐标
//        }, 2000);

    }
});
