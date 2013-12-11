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
    var userId = Library.generateId.getUserId();
    var usersInfo = {};
    var historyLocMaxLen = 10;
    var userName = localStorage.getItem('userName') || '';

    var getLocation = function(){
        groupId = session.get('groupId');
        fetchOptions.groupId = groupId;

        session.location = env.subscribe('pubLocation', fetchOptions,function(locationCollection){
            locationCollection.getData().forEach(function(item){
                usersInfo[item.userId] = item;
            });


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

    env.onready = function(viewRoot){
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


//        if(!map) {
//            map = new BMap.Map("map");            // 创建Map实例
//            var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
//            map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
//            map.enableScrollWheelZoom();                            //启用滚轮放大缩小
//        }
//
//        Library.touch.on("#positionBtn","touchend",getPosition);
    };


//    navigator.geolocation.watchPosition(successCallback,
//        errorCallback,
//        {maximumAge:600000, enableHighAccuracy:true});

    window.setInterval(successCallback,5000);

    function successCallback(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
        if(position) {
            var p = new BMap.Point(position.coords.longitude, position.coords.latitude);
            var mk = new BMap.Marker(p);
           map.addOverlay(mk);
            map.panTo(p);
        } else {
            var p = {lng:Math.random(),lat:Math.random()};
        }

        var coordinateItem = {
            'x':p.lng,
            'y':p.lat
        };

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
                usersInfo[userId].coordinate.splice(0,currLocLen - historyLocMaxLen + (1+ historyLocMaxLen/10));
            }
            usersInfo[userId].coordinate.push(coordinateItem);

            session.location.update({'groupId':groupId,'userId':userId},{'name':userName,'coordinate':usersInfo[userId].coordinate});
        }
        session.location.save();
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
