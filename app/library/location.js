/**
 * Created by yunlong on 13-12-11.
 */
Library.location = sumeru.Library.create(function(exports){

    exports.genererateLoction = function(isFake,successCallback,errorCallback){
        var callBack = {
            error: errorCallback || function(error){
                console.log('H5 failed ', error);
            },

            success : successCallback ||function(position){
                console.log('H5 success ', position.coords);
            }
        }

        isFake?fakeGenFunc(callBack):realGenFunc(callBack);
    };

    exports.formatLoction = function(originPoint){
        var formatPot = {};
        if(originPoint.coords) {
            formatPot = {
                lat:originPoint.coords.latitude,
                lng:originPoint.coords.longitude
            };
        } else if(originPoint.point){
            formatPot = {
                lat:originPoint.point.lat,
                lng:originPoint.point.lng
            };

        } else {
            formatPot = originPoint;
        }

        return formatPot;

    };


    var realGenFunc = function(callback){

        var timeInterval = 25000;
        var positionOptions = {
            enableHighAccuracy:true,
            maximumAge:20000,
            enableHighAccuracy:true
        }
        var geolocation = new BMap.Geolocation();

        var generateNewLoc = function(){
            geolocation.getCurrentPosition(locCallback,positionOptions);
        }

        var locCallback = function(pos){
            var status = geolocation.getStatus();
            if(BMAP_STATUS_SUCCESS == status){
                callback.success(pos);
            } else {
                callback.error(status);
            }
        }


        setInterval(generateNewLoc,timeInterval);
    };


    var fakeGenFunc = function(callback){

        var baseLoc = {
            lat:116.387428,
            lng:39.90923
        };

        var baseStep = 0.05;
        var timeInterval = 5000;
        var currentLoc = exports.currentLoc;

        var generateNewLoc = function(){
            var newLoc = {};
            if(!currentLoc) {
                newLoc.lat = baseLoc.lat + adjustValue(1);
                newLoc.lng = baseLoc.lng + adjustValue(1);
            } else {
                newLoc.lat = currentLoc.lat + adjustValue();
                newLoc.lng = currentLoc.lng + adjustValue();
            }

            newLoc.time = new Date().getTime();
            currentLoc = newLoc;

            callback.success(newLoc);

        };

        function adjustValue(rate){
            if(!rate) {
                rate = 0.005;
            }

            var adjust = Math.random() * baseStep * rate;
            return adjust;
        };

        setInterval(generateNewLoc,timeInterval);

    };

    return exports;
});
