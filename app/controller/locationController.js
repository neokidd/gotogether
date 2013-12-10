/**
 * Created by yunlong on 13-12-5.
 */
sumeru.router.add(
    {
        pattern: 'location',
        action: 'App.location'
    }
);


App.location = sumeru.controller.create(function(env, session){

    var fetchOptions = {};
    var groupId;

    var getLocation = function(){
        groupId = session.get('groupId');
        fetchOptions.groupId = groupId;

        session.location = env.subscribe('pubLocation', fetchOptions,function(locationCollection){
            console.log(locationCollection);
            session.bind('locationLogBlock', {
                data : locationCollection.find()
            });

        });
    };
    env.onload = function(){
        return [getLocation];
    };
    env.onrender = function(doRender){
        doRender("location", ['push','right']);
    };

    var map;

    env.onready = function(){
        if(!map) {
            map = new BMap.Map("map");            // 创建Map实例
            var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
            map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
            map.enableScrollWheelZoom();                            //启用滚轮放大缩小
        }

        Library.touch.on("#positionBtn","touchend",getPosition);
    };


    navigator.geolocation.watchPosition(successCallback,
        errorCallback,
        {maximumAge:600000, enableHighAccuracy:true});

    function successCallback(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
        var p = new BMap.Point(position.coords.longitude, position.coords.latitude);
        var mk = new BMap.Marker(p);
        map.addOverlay(mk);
        map.panTo(p);

        var newItem = {
            'userid':sumeru.clientId,
            'groupid':groupId,
            'x':p.lng,
            'y':p.lat
        };

        session.location.add(newItem);
        session.location.save();


//        console.log('您的H5位置：',p.lng,p.lat);
//        document.getElementById("txtlog").innerHtml= i++ + ' 您的H5位置：'+p.lng+','+p.lat;
    }

    function errorCallback(error) {
        // Update a div element with error.message.
        alert('H5 failed'+ error.code);
    }

    function getPosition() {
        navigator.geolocation.getCurrentPosition(successCallback,
            errorCallback,
            {maximumAge:600000, enableHighAccuracy:true});
    }
});
