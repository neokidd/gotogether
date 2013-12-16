/**
 * Created by yunlong on 13-12-5.
 */
sumeru.router.add(
    {
        pattern: '/location',
        action: 'App.location'
    }
);


App.location = sumeru.controller.create(function(env, session){

    var fetchOptions = {};
    var groupId;
    var userId = Library.generateId.getUserId();
    var usersInfo = {};
    var historyLocMaxLen = 10;
    var userName = localStorage.getItem('userName') || '';
    var map;
    var locSuccessCallback;
    var roleController = Library.mapOverlay.createRoleController();

    var getLocation = function(){
        groupId = session.get('groupId');
        fetchOptions.groupId = groupId;
        var isDebug = parseInt(session.get('debug'));

        session.location = env.subscribe('pubLocation', fetchOptions,function(locationCollection){
            locationCollection.getData().forEach(function(item){
                usersInfo[item.userId] = item;
            });

            session.bind('locationLogBlock', {
                data : locationCollection.find(),
                debug : isDebug
            });

            if(map) {
                roleController.updateRolesData(locationCollection.getData());
                roleController.run(map);
            }

        });

    };
    env.onload = function(){
        return [getLocation];
    };
    env.onrender = function(doRender){
        doRender("location", ['push','right']);
    };

    env.onready = function(viewRoot){
        initMap();

        var usernameInput = viewRoot.querySelector("#usernameInput");
        usernameInput.value = userName;

        Library.touch.on("#setUsername","touchend",function(){
            var userNameTemp = usernameInput.value.trim();
            if('' == userNameTemp){
                alert('input your name firstly');
                return false;
            }

            userName = userNameTemp;
            localStorage.setItem('userName',userName);

        });

//        Library.touch.on("#positionBtn","touchend",getPosition);
    };


//    navigator.geolocation.watchPosition(locSuccessCallback,
//        errorCallback,
//        {maximumAge:600000, enableHighAccuracy:true});

    function initMap(){
        if(!map) {
            map = new BMap.Map("map");            // 创建Map实例
            var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
            map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
            map.enableScrollWheelZoom();                            //启用滚轮放大缩小
            map.addControl(new BMap.NavigationControl());
        }
    }

    locSuccessCallback = function(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
//        if(position) {
//            var p = new BMap.Point(position.coords.longitude, position.coords.latitude);
//            var mk = new BMap.Marker(p);
//            map.addOverlay(mk);
//            map.panTo(p);
//        } else {
//            var p = {lng:Math.random(),lat:Math.random()};
//        }
//
//        var coordinateItem = {
//            'x':p.lng,
//            'y':p.lat
//        };

        var locArr = usersInfo[userId] && usersInfo[userId].coordinate;
        var coordinateItem = Library.generateLocation.generateNextLoc(locArr);

        if(!usersInfo[userId]) {
            var newItem = {
                'userId':userId,
                'groupId':groupId,
                'coordinate':[coordinateItem],
                'name':userName
            };

            session.location.add(newItem);
        } else{
            var currLocLen = usersInfo[userId].coordinate.length;
            if(historyLocMaxLen <= currLocLen ) {
                usersInfo[userId].coordinate.splice(0,currLocLen - historyLocMaxLen );
            }
            usersInfo[userId].coordinate.push(coordinateItem);

            session.location.update({'name':userName},{'groupId':groupId,'userId':userId});
        }
        session.location.save();
    }

    function errorCallback(error) {
        // Update a div element with error.message.
        alert('H5 failed'+ error.code);
    }

    function getPosition() {
        navigator.geolocation.getCurrentPosition(locSuccessCallback,
            errorCallback,
            {maximumAge:600000, enableHighAccuracy:true});
    }

    window.setInterval(locSuccessCallback,5000);
});
