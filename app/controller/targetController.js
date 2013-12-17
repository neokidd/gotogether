/**
 * Created by yunlong on 13-12-17.
 */
sumeru.router.add(
    {
        pattern: '/target',
        action: 'App.target'
    }
);

App.target = sumeru.controller.create(function(env, session){

    var map;

    env.onrender = function(doRender){
        doRender("target", ['push','left']);
    };

    env.onready = function(viewRoot){
        map = Library.bMapUtil.initMap(viewRoot.querySelector('#map'));
        Library.bMapUtil.keywordLocation(map,viewRoot.querySelector('#suggestId'));
        var suggestAdressInput = viewRoot.querySelector('#suggestId');
        suggestAdressInput.innerHTML = '';

        session.event('inputTarget',function(){
            Library.touch.on('#goHome','touchend',function(){
                env.redirect("/home");
            });

            Library.touch.on('#setself','touchend',function(){
                Library.bMapUtil.getLocation(locationCallback,null,locationLoadingFunc);
            });
        });

        function locationCallback(pos){
            console.log("@@@",pos);
            map.clearOverlays();
            var formatPos = Library.location.formatLoction(pos);
            localStorage.setItem('targetPos',formatPos);
            var bPoint = new BMap.Point(pos.lng,pos.lat);
            Library.location.pointToAddress(bPoint,setAddress);

            markergps = new BMap.Marker(bPoint);
            map.addOverlay(markergps);

            var labelgps = new BMap.Label("终点",{offset:new BMap.Size(20,-10)});
            markergps.setLabel(labelgps);

            map.panTo(bPoint);
        };

        function setAddress(addressObj,addressStr){
            suggestAdressInput.value = addressStr;
            localStorage.setItem('targetAddress',addressStr);
        };

        function locationLoadingFunc(){
            suggestAdressInput.value = "正在查询你的位置，请等待...";
        };

    }

});