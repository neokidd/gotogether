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
        Library.bMapUtil.keywordLocation(map,viewRoot.querySelector('#suggestId'),keyworkLocationCallback);
        var suggestAdressInput = viewRoot.querySelector('#suggestId');
        suggestAdressInput.innerHTML = '';

        session.event('inputTarget',function(){
            Library.touch.on('#goBack','touchend',function(){
                var routeAction = session.get('prePage');
                env.redirect(routeAction);
            });

            Library.touch.on('#setself','touchend',function(){
                Library.bMapUtil.getLocation(locationCallback,locationErrorCallback,locationLoadingFunc);
            });
        });

        function keyworkLocationCallback(bPos,address){
            var formatPos = Library.location.formatLoction(bPos);
            sessionStorage.setItem('targetPos-lat',formatPos.lat);
            sessionStorage.setItem('targetPos-lng',formatPos.lng);
            sessionStorage.setItem('targetAddress',address);
            document.querySelector('#targetName').value = address;
        }

        function locationCallback(pos){
            console.log("@@@",pos);
            map.clearOverlays();
            var formatPos = Library.location.formatLoction(pos);
            sessionStorage.setItem('targetPos-lat',formatPos.lat);
            sessionStorage.setItem('targetPos-lng',formatPos.lng);
            var bPoint = new BMap.Point(pos.lng,pos.lat);
            Library.location.pointToAddress(bPoint,setAddress);

            markergps = new BMap.Marker(bPoint);
            map.addOverlay(markergps);

            var labelgps = new BMap.Label("终点",{offset:new BMap.Size(20,-10)});
            markergps.setLabel(labelgps);

            map.panTo(bPoint);

            if(session.get('prePage') == '/location') {
                sessionStorage.setItem('updateTargetFlag',1);
            }
        };

        function setAddress(addressObj,addressStr){
            suggestAdressInput.value = addressStr;
            sessionStorage.setItem('targetAddress',addressStr);

            updateAllTargetInput(addressStr);
        };

        function updateAllTargetInput(addressStr){
            var addressPool = [];
            addressPool.push(document.querySelector('#targetName'));
            addressPool.push(document.querySelector('#locationTargetAddress'));
            addressPool.forEach(function(item){
                if(item && item.value) {
                    item.value = addressStr;
                }
            });
        }

        function locationLoadingFunc(){
            suggestAdressInput.value = "正在查询你的位置，请等待...";
        };

        function locationErrorCallback(status){
            suggestAdressInput.value = status;
        };

    }

});