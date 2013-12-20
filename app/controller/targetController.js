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
    var mouseChoosePosFlag = false;

    env.onrender = function(doRender){
        doRender("target", ['push','left']);
    };

    env.onready = function(viewRoot){
        map = Library.bMapUtil.initMap(viewRoot.querySelector('#map'));
        Library.bMapUtil.keywordLocation(map,viewRoot.querySelector('#suggestId'),keyworkLocationCallback);
        var suggestAdressInput = viewRoot.querySelector('#suggestId');

//        if(!sessionStorage.getItem('targetPos-lat')) {
            $("#goOn").hide();
//        }

        Library.touch.on('#goOn','touchend',function(){
            mouseChoosePosFlag = false;
            env.redirect('/location');
        });

        Library.touch.on('#setself','touchend',function(){
            Library.bMapUtil.getLocation(locationCallback,locationErrorCallback,locationLoadingFunc);
            $('#selectDestinationMethod').hide();
        });

        Library.touch.on('#setDestination','touchend',function(){
            $('#selectDestinationMethod').toggle();
            $('#r-result').hide();
            mouseChoosePosFlag = false;
        });

        Library.touch.on('#setAddressFormLBS','touchend',function(){
            //从地图获取目的地
            mouseChoosePosFlag = true;
            $('#selectDestinationMethod').hide();
        });

        Library.touch.on('#inputAddress','touchend',function(){
            //获取输入目的地的值
            $('#selectDestinationMethod').hide();
            $('#r-result').show();

        });

        Library.touch.on('#cancelOption','touchend',function(){
//            $('#selectDestinationMethod').hide();
            $('#inputAddress').hide();
        });

        map.addEventListener("click",function(e){
            if(mouseChoosePosFlag) {
                locationCallback(e.point);
            }
        });


        function keyworkLocationCallback(bPos,address){
            var formatPos = Library.location.formatLoction(bPos);
            sessionStorage.setItem('targetPos-lat',formatPos.lat);
            sessionStorage.setItem('targetPos-lng',formatPos.lng);
            sessionStorage.setItem('targetAddress',address);

            finishSetAddress();
        }

        function locationCallback(pos){
            console.log("@@@",pos);
            map.clearOverlays();
            var formatPos = Library.location.formatLoction(pos);
            sessionStorage.setItem('targetPos-lat',formatPos.lat);
            sessionStorage.setItem('targetPos-lng',formatPos.lng);
            var bPoint = new BMap.Point(pos.lng,pos.lat);
            Library.bMapUtil.pointToAddress(bPoint,setAddress);

            markergps = new BMap.Marker(bPoint);
            map.addOverlay(markergps);

            var labelgps = new BMap.Label("终点",{offset:new BMap.Size(20,-10)});
            markergps.setLabel(labelgps);

            map.panTo(bPoint);

//            if(session.get('prePage') == '/location') {
//                sessionStorage.setItem('updateTargetFlag',1);
//            }

            finishSetAddress();
        };

        function finishSetAddress(){
            $("#goOn").show();
        }


        function setAddress(addressObj,addressStr){
            suggestAdressInput.value = addressStr;
            sessionStorage.setItem('targetAddress',addressStr);
        };

        function locationLoadingFunc(){
            $('#r-result').show();
            suggestAdressInput.value = "正在查询你的位置，请等待...";
        };

        function locationErrorCallback(status){
            alert('定位出错服务忙，请选择其他方式设定终点！')
//            suggestAdressInput.value = status;
            $('#r-result').hide();
            $('#selectDestinationMethod').show();
        };

    }

});